/**
 * Gemini API Proxy — Vercel Serverless Function
 *
 * Proxies requests to the Gemini API using a server-side API key,
 * so end users don't need to configure their own.
 *
 * Edge cases handled:
 * - Supports both AIzaSy (query param) and AQ. (Bearer) key formats
 * - Streams SSE responses back to the client
 * - Returns proper CORS headers
 *
 * Vercel free tier timeout is 10s — if generation takes longer,
 * the function may terminate early. Upgrade to Pro for 60s limit.
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
    const { prompt, model = 'gemini-2.0-flash' } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Missing required field: prompt' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'Server: GEMINI_API_KEY not configured' });
      return;
    }

    // Determine auth method based on key format
    const isAQKey = apiKey.startsWith('AQ.');
    const url = isAQKey
      ? `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`
      : `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`;

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (isAQKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      res.status(response.status).json({ error: `Gemini API error: ${err}` });
      return;
    }

    // Stream the response back as SSE
    const reader = response.body?.getReader();
    if (!reader) {
      res.status(500).json({ error: 'No response body from Gemini' });
      return;
    }

    const decoder = new TextDecoder();
    let buffer = '';

    // Set up SSE headers
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
      // Flush complete SSE lines, keep partial in buffer
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (line.trim()) {
          res.write(line + '\n');
        }
      }
      // @ts-ignore — flush not in TS types but available in Node
      res.flush?.();
    }
  } catch (err: any) {
    console.error('API proxy error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message || 'Internal server error' });
    }
  }
}
