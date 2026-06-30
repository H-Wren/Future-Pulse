/**
 * DeepSeek API Proxy — Vercel Serverless Function
 *
 * Proxies requests to the DeepSeek API using a server-side API key,
 * so end users don't need to configure their own.
 *
 * Vercel free tier timeout is 10s — if generation takes longer,
 * the function may terminate early.
 */

import type { IncomingMessage, ServerResponse } from 'node:http';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { prompt, model = 'deepseek-chat' } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Missing required field: prompt' });
      return;
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'Server: DEEPSEEK_API_KEY not configured' });
      return;
    }

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
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

    if (!response.ok) {
      const err = await response.text();
      res.status(response.status).json({ error: `DeepSeek API error: ${err}` });
      return;
    }

    // Stream the response back as SSE
    const reader = response.body?.getReader();
    if (!reader) {
      res.status(500).json({ error: 'No response body from DeepSeek' });
      return;
    }

    const decoder = new TextDecoder();
    let buffer = '';

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.status(200);

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        if (buffer.trim()) res.write(buffer);
        res.end();
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (line.trim()) {
          res.write(line + '\n');
        }
      }
      // @ts-ignore
      res.flush?.();
    }
  } catch (err: any) {
    console.error('DeepSeek API proxy error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message || 'Internal server error' });
    }
  }
}
