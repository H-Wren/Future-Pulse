/** AI Provider abstraction layer */

export type ProviderId = 'gemini' | 'openai' | 'claude' | 'deepseek' | 'moonshot';

export interface ProviderConfig {
  apiKey: string;
  model: string;
}

export interface AIProvider {
  id: ProviderId;
  name: string;
  models: string[];
  defaultModel: string;
  needsProxy: boolean; // true if provider requires CORS proxy
  generateStream(prompt: string, config: ProviderConfig): AsyncIterable<string>;
}

// ===== Gemini Provider (REST API — supports AQ. keys) =====

async function* geminiStream(prompt: string, config: ProviderConfig): AsyncIterable<string> {
  const isAQKey = config.apiKey.startsWith('AQ.');
  const url = isAQKey
    ? `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:streamGenerateContent?alt=sse`
    : `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:streamGenerateContent?alt=sse&key=${encodeURIComponent(config.apiKey)}`;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (isAQKey) {
    headers['Authorization'] = `Bearer ${config.apiKey}`;
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
    throw new Error(`Gemini API error (${response.status}): ${err}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data: ')) continue;
      const data = trimmed.slice(6);
      if (data === '[DONE]') return;

      try {
        const parsed = JSON.parse(data);
        const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) yield text;
      } catch {
        // skip malformed chunks
      }
    }
  }
}

// ===== OpenAI Provider =====

async function* openaiStream(prompt: string, config: ProviderConfig): AsyncIterable<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${err}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data: ')) continue;
      const data = trimmed.slice(6);
      if (data === '[DONE]') return;

      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) yield content;
      } catch {
        // skip malformed chunks
      }
    }
  }
}

// ===== Anthropic Claude Provider =====

async function* claudeStream(prompt: string, config: ProviderConfig): AsyncIterable<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude API error (${response.status}): ${err}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data: ')) continue;
      const data = trimmed.slice(6);

      try {
        const parsed = JSON.parse(data);
        if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
          yield parsed.delta.text;
        }
      } catch {
        // skip
      }
    }
  }
}

// ===== DeepSeek Provider =====

async function* deepseekStream(prompt: string, config: ProviderConfig): AsyncIterable<string> {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
      temperature: 0.6,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`DeepSeek API error (${response.status}): ${err}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data: ')) continue;
      const data = trimmed.slice(6);
      if (data === '[DONE]') return;

      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) yield content;
      } catch {
        // skip
      }
    }
  }
}

// ===== Moonshot (Kimi) Provider =====

async function* moonshotStream(prompt: string, config: ProviderConfig): AsyncIterable<string> {
  const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Moonshot API error (${response.status}): ${err}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data: ')) continue;
      const data = trimmed.slice(6);
      if (data === '[DONE]') return;

      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) yield content;
      } catch {
        // skip
      }
    }
  }
}

// ===== Provider Registry =====

export const PROVIDERS: Record<ProviderId, AIProvider> = {
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    models: ['gemini-2.5-flash-preview-04-17', 'gemini-2.5-pro-preview-03-25', 'gemini-3.5-flash'],
    defaultModel: 'gemini-3.5-flash',
    needsProxy: false,
    generateStream: geminiStream,
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    models: ['gpt-4o', 'gpt-4o-mini', 'o3-mini'],
    defaultModel: 'gpt-4o-mini',
    needsProxy: false,
    generateStream: openaiStream,
  },
  claude: {
    id: 'claude',
    name: 'Anthropic Claude',
    models: ['claude-sonnet-4-20250514', 'claude-haiku-3-5-20250115'],
    defaultModel: 'claude-sonnet-4-20250514',
    needsProxy: true,
    generateStream: claudeStream,
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    models: ['deepseek-chat', 'deepseek-reasoner'],
    defaultModel: 'deepseek-chat',
    needsProxy: false,
    generateStream: deepseekStream,
  },
  moonshot: {
    id: 'moonshot',
    name: 'Moonshot (Kimi)',
    models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
    defaultModel: 'moonshot-v1-8k',
    needsProxy: false,
    generateStream: moonshotStream,
  },
};

// ===== API Key Storage =====

const KEY_PREFIX = 'fp-api-key-';

export function getStoredApiKey(providerId: ProviderId): string {
  try {
    return localStorage.getItem(`${KEY_PREFIX}${providerId}`) ?? '';
  } catch {
    return '';
  }
}

export function storeApiKey(providerId: ProviderId, key: string): void {
  try {
    if (key) {
      localStorage.setItem(`${KEY_PREFIX}${providerId}`, key);
    } else {
      localStorage.removeItem(`${KEY_PREFIX}${providerId}`);
    }
  } catch {
    // localStorage unavailable
  }
}

const MODEL_PREFERENCE_KEY = 'fp-preferred-model';

export function getStoredModel(providerId: ProviderId): string {
  try {
    return localStorage.getItem(`${MODEL_PREFERENCE_KEY}-${providerId}`) ?? '';
  } catch {
    return '';
  }
}

export function storeModel(providerId: ProviderId, model: string): void {
  try {
    localStorage.setItem(`${MODEL_PREFERENCE_KEY}-${providerId}`, model);
  } catch {
    // ignore
  }
}
