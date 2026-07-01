/**
 * Future Pulse — Cloudflare Worker (DeepSeek API Proxy)
 *
 * Proxies requests to api.deepseek.com with a server-side API key.
 * Handles CORS so the public GitHub Pages site can call it.
 *
 * Deploy: npx wrangler deploy
 * Secret: npx wrangler secret put DEEPSEEK_API_KEY
 */

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const ALLOWED_ORIGINS = [
  'https://h-wren.github.io',
  'http://localhost:3000',
  'http://localhost:5173',
];
const API_KEY_PLACEHOLDER = 'YOUR_DEEPSEEK_API_KEY_HERE';

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function hasValidApiKey(env) {
  return Boolean(env.DEEPSEEK_API_KEY && env.DEEPSEEK_API_KEY !== API_KEY_PLACEHOLDER);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(request),
      });
    }

    if (request.method === 'GET' && url.pathname.endsWith('/health')) {
      return new Response(JSON.stringify({
        ok: true,
        service: 'future-pulse-worker',
        hasDeepSeekKey: hasValidApiKey(env),
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(request) },
      });
    }

    // Only accept POST to /api/deepseek
    if (request.method !== 'POST' || !url.pathname.endsWith('/api/deepseek')) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(request) },
      });
    }

    if (!hasValidApiKey(env)) {
      return new Response(JSON.stringify({ error: 'Server: DEEPSEEK_API_KEY is not configured as a Cloudflare secret' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(request) },
      });
    }
    const apiKey = env.DEEPSEEK_API_KEY;

    try {
      const { prompt, model = 'deepseek-chat' } = await request.json();

      if (!prompt) {
        return new Response(JSON.stringify({ error: 'Missing required field: prompt' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders(request) },
        });
      }

      const deepseekResp = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          stream: true,
        }),
      });

      if (!deepseekResp.ok) {
        const errText = await deepseekResp.text();
        return new Response(
          JSON.stringify({ error: `DeepSeek API error (${deepseekResp.status}): ${errText}` }),
          {
            status: deepseekResp.status,
            headers: { 'Content-Type': 'application/json', ...corsHeaders(request) },
          }
        );
      }

      // Transform OpenAI SSE → Gemini SSE format (matching Vercel proxy behavior)
      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();
      let buffer = '';

      deepseekResp.body.pipeTo(new WritableStream({
        write(chunk) {
          buffer += decoder.decode(chunk, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;

            const raw = trimmed.slice(6);
            if (raw === '[DONE]') {
              writer.write(encoder.encode('data: [DONE]\n\n'));
              continue;
            }

            try {
              const chunk = JSON.parse(raw);
              const content = chunk.choices?.[0]?.delta?.content;
              if (content) {
                const geminiChunk = JSON.stringify({
                  candidates: [{ content: { parts: [{ text: content }] } }],
                });
                writer.write(encoder.encode(`data: ${geminiChunk}\n\n`));
              }
            } catch {
              // skip unparseable chunks
            }
          }
        },
        close() {
          writer.close();
        },
        abort(reason) {
          writer.abort(reason);
        },
      }));

      return new Response(readable, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          ...corsHeaders(request),
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message || 'Internal error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(request) },
      });
    }
  },
};
