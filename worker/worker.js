/**
 * Future Pulse — Cloudflare Worker (DeepSeek API Proxy)
 *
 * Proxies requests to api.deepseek.com with the server-side API key embedded.
 * Handles CORS so the public GitHub Pages site can call it.
 *
 * Deploy: npx wrangler deploy
 */

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const ALLOWED_ORIGINS = [
  'https://h-wren.github.io',
  'http://localhost:3000',
  'http://localhost:5173',
];

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
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

    // Only accept POST to /api/deepseek
    if (request.method !== 'POST' || !url.pathname.endsWith('/api/deepseek')) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(request) },
      });
    }

    const apiKey = env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Server: API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(request) },
      });
    }

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

      deepseekResp.body.pipeTo(new WritableStream({
        write(chunk) {
          const text = new TextDecoder().decode(chunk, { stream: true });
          const lines = text.split('\n');
          const encoder = new TextEncoder();

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
