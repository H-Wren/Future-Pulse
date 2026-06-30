import { useState, useCallback, useRef } from 'react';
import { PROVIDERS, getStoredApiKey, getStoredModel, storeModel } from '../utils/providers';
import type { ProviderId } from '../utils/providers';
import type { ReportStatus } from '../types/report';

export type TimeRange = '3d' | '1w' | '1m' | '3m';
export type ReportLang = 'zh' | 'en';

export const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  '3d': '3 天内',
  '1w': '一周内',
  '1m': '一个月内',
  '3m': '三个月内',
};

const TIME_RANGE_DAYS: Record<TimeRange, number> = {
  '3d': 3,
  '1w': 7,
  '1m': 30,
  '3m': 90,
};

const DEFAULT_RESUME = `核心能力与经验：
1. 具备全链路及项目闭环管理经验，主导多项重点工程。
2. 技术驱动的产品化能力：整合自动化工具与AI模型重构生产流，实现效能显著提升并解决转码痛点和跨平台协作问题。
3. 项目管理与跨部门协同：统筹管理多个战略项目，在并行状态下实现从研发、质控到交付的零误差闭环。
4. 品牌赋能与跨文化产品洞察：擅长国际化产品叙事重构与元数据优化，提升B端采购转化率并推动产品打入顶级机构。
5. 技能与工具：精通行业工具与专业及合规标准；深入使用与整合 LLMs 等 AI 工具进行业务管线提效。
（您可以将真实简历内容粘贴至此，或上传 PDF 自动解析）`;

const DEFAULT_FOCUS = '产品管理转型、工作流提效、结构化思维赋能';

function buildPrompt(resume: string, focus: string, timeRange: TimeRange, reportLang: ReportLang): string {
  const days = TIME_RANGE_DAYS[timeRange];
  const rangeLabel = TIME_RANGE_LABELS[timeRange];
  const isEnglish = reportLang === 'en';

  const sources = isEnglish
    ? `Official blogs (OpenAI, DeepMind, Anthropic, Meta AI, Microsoft AI), X accounts (@sama, @demishassabis, @dariogazitam, @kaboroevic, @ylecun, @elonmusk), arXiv, GitHub Trending, Hugging Face.`
    : `官方博客（OpenAI、DeepMind、Anthropic、Meta AI、微软 AI）、X/Twitter（@sama、@demishassabis、@kaboroevic、@ylecun、@elonmusk）、arXiv、GitHub Trending、Hugging Face、机器之心、量子位。`;

  const checklist = isEnglish
    ? `1) New model releases & major updates 2) Tool ecosystem (Cursor, Claude Code, Copilot, v0, Bolt) 3) Open-source breakthroughs 4) AI policy/regulation 5) Compute/chip news 6) Competitive matrix: ChatGPT/OpenAI, Gemini/Google, Claude/Anthropic, Grok/xAI, DeepSeek, Kimi, Qwen, Doubao.`
    : `1) 新模型发布与重大更新 2) 工具生态（Cursor、Claude Code、Copilot、v0、Bolt） 3) 开源突破 4) AI 政策监管 5) 算力芯片新闻 6) 竞品矩阵：ChatGPT/OpenAI、Gemini/Google、Claude/Anthropic、Grok/xAI、DeepSeek、Kimi、Qwen、豆包。`;

  const dateStr = isEnglish
    ? new Date().toLocaleDateString('en-US')
    : new Date().toLocaleDateString('zh-CN');

  if (isEnglish) {
    return `You are an AI Intelligence Analyst. Research the most important AI developments from the past ${days} days (${rangeLabel}) and deliver a concise, actionable report tailored to the user's career profile.

**CRITICAL**: Write the entire report in English. Every claim must cite a verifiable source URL.

**Sources to prioritize**: ${sources}

**Checklist**: ${checklist}

**User Profile**:
${resume}

**Focus Areas**: ${focus}

**Instructions**:
- Match new AI capabilities to the user's specific skills and responsibilities.
- For each match, provide a concrete action with estimated time commitment.
- Explain technical concepts in plain language. Add "→ In plain English:" after jargon.

**Output Format**:

# 🗓️ AI Intelligence Report
**${dateStr} · ${rangeLabel} Scan**

## Executive Summary
> 3-5 key takeaways — reader should grasp the big picture in 30 seconds.

## 🔥 Breakthroughs
Each item: what changed, why it matters, source URL.

## 📊 Competitive Landscape
| Model | Company | ${rangeLabel} Update | Capability |

## 💡 Career Opportunities
Match to user profile → Recommended action → Time estimate

## ⚠️ Risks & Actions
Key risks + prioritized action items (High/Medium/Follow-up)

## 📚 Sources
- [Title](URL) — Type`;
  }

  return `你是一名 AI 技术情报分析师。检索过去 ${days} 天（${rangeLabel}内）全球 AI 最重要进展，结合用户职业背景，输出一份精炼可落地的中文报告。

**每条信息必须注明可查证的来源 URL。**

**优先来源**：${sources}

**检索清单**：${checklist}

**用户画像**：
${resume}

**关注领域**：${focus}

**要求**：
- 将 AI 新能力与用户技能精确匹配，给出具体行动建议和预估时间投入
- 用通俗语言解释技术概念，术语后加 "→ 人话："
- 控制篇幅，避免信息堆砌

**输出格式**：

# 🗓️ AI 技术情报报告
**${dateStr} · ${rangeLabel}检索**

## 执行摘要
> 30 秒掌握全局的 3-5 个核心结论

## 🔥 本期突破
每项含：变化描述、为什么重要、来源 URL

## 📊 主流 AI 战力分布
| 模型 | 公司 | ${rangeLabel}最新动态 | 能力评估 |

## 💡 职业机会
匹配用户画像 → 建议行动 → 预估时间

## ⚠️ 风险与行动
关键风险 + 按优先级排序的行动项（高/中/跟进）

## 📚 来源
- [标题](URL) — 类型`;
}


/**
 * Returns true when the app is deployed on Vercel and should
 * proxy API calls through the serverless function.
 */
function useServerApi(): boolean {
  try {
    return (process.env.VITE_USE_SERVER_API as string) === 'true';
  } catch {
    return false;
  }
}

/**
 * Returns true when the app is running in public mode.
 * In public mode, API key UI is hidden and the API key is baked into the build.
 */
export function isPublicMode(): boolean {
  try {
    return (process.env.VITE_PUBLIC_MODE as string) === 'true';
  } catch {
    return false;
  }
}

export function useGenerateReport() {
  const [resume, setResume] = useState(DEFAULT_RESUME);
  const [focus, setFocus] = useState(DEFAULT_FOCUS);
  const [report, setReport] = useState('');
  const [status, setStatus] = useState<ReportStatus>('idle');
  const [error, setError] = useState('');
  const [providerId, setProviderId] = useState<ProviderId>('deepseek');
  const [model, setModel] = useState(PROVIDERS.deepseek.defaultModel);
  const [timeRange, setTimeRange] = useState<TimeRange>('1w');
  const [reportLang, setReportLang] = useState<ReportLang>('zh');
  const abortRef = useRef<AbortController | null>(null);

  const handleProviderChange = useCallback((newProvider: ProviderId) => {
    setProviderId(newProvider);
    const stored = getStoredModel(newProvider);
    if (stored && PROVIDERS[newProvider].models.includes(stored)) {
      setModel(stored);
    } else {
      setModel(PROVIDERS[newProvider].defaultModel);
    }
  }, []);

  const handleModelChange = useCallback((newModel: string) => {
    setModel(newModel);
    storeModel(providerId, newModel);
  }, [providerId]);

  const generateReport = useCallback(async () => {
    if (!resume.trim() || !focus.trim()) return;

    const publicMode = isPublicMode();
    const provider = PROVIDERS[providerId];

    // In public mode: skip localStorage API key check (key is baked into build)
    if (!publicMode) {
      const apiKey = getStoredApiKey(providerId);
      const resolvedKey =
        apiKey
        || (providerId === 'gemini' ? (process.env.GEMINI_API_KEY as string) : '')
        || (providerId === 'deepseek' ? (process.env.VITE_DEEPSEEK_API_KEY as string) : '');

      if (!resolvedKey) {
        setError(`${provider.name} API Key 未配置。请在 .env 文件中设置，或通过"配置 API Key"输入。`);
        setStatus('error');
        return;
      }
    }

    setStatus('generating');
    setError('');
    setReport('');

    abortRef.current = new AbortController();

    try {
      const prompt = buildPrompt(resume, focus, timeRange, reportLang);

      // Resolve API key: public mode uses baked-in key, otherwise localStorage or env
      const apiKey = publicMode
        ? (process.env.VITE_DEEPSEEK_API_KEY as string) || ''
        : (getStoredApiKey(providerId)
            || (providerId === 'gemini' ? (process.env.GEMINI_API_KEY as string) : '')
            || (providerId === 'deepseek' ? (process.env.VITE_DEEPSEEK_API_KEY as string) : ''));

      // Quick connectivity test (public mode only)
      if (publicMode) {
        try {
          const testResp = await fetch('https://api.deepseek.com/v1/models', {
            headers: { Authorization: `Bearer ${apiKey}` },
            signal: AbortSignal.timeout(8000),
          });
          console.log('[Future Pulse] API reachable, status:', testResp.status);
        } catch (netErr: any) {
          console.error('[Future Pulse] API unreachable:', netErr.message || netErr);
          throw new Error(`网络不通：无法连接 DeepSeek API（${netErr.message || '超时'}）。请检查网络或尝试 VPN。`);
        }
      }

      if (publicMode) {
        // Public mode: direct API call with baked-in key (no proxy needed)
        const stream = provider.generateStream(prompt, {
          apiKey,
          model,
        });

        let fullText = '';
        for await (const chunk of stream) {
          if (abortRef.current?.signal.aborted) break;
          fullText += chunk;
          setReport(fullText);
        }
      } else if (useServerApi() && (providerId === 'gemini' || providerId === 'deepseek')) {
        // Use the Vercel serverless API proxy
        const proxyPath = providerId === 'deepseek' ? '/api/deepseek' : '/api/gemini';
        await generateViaServerApi(prompt, proxyPath);
      } else {
        // Use direct API call (local dev or non-proxied providers)
        const stream = provider.generateStream(prompt, {
          apiKey,
          model,
        });

        let fullText = '';
        for await (const chunk of stream) {
          if (abortRef.current?.signal.aborted) break;
          fullText += chunk;
          setReport(fullText);
        }
      }

      if (!abortRef.current?.signal.aborted) {
        setStatus('complete');
      }
    } catch (err: any) {
      console.error('[Future Pulse] Generate error:', err);
      const detail = err?.cause?.message || err?.message || String(err);
      setError(detail || '生成报告时发生错误');
      setStatus('error');
    } finally {
      if (abortRef.current?.signal.aborted) {
        setStatus('idle');
      }
      abortRef.current = null;
    }
  }, [resume, focus, providerId, model, timeRange, reportLang]);

  /** Proxy generation through the Vercel serverless function */
  const generateViaServerApi = async (prompt: string, proxyPath: string) => {
    const response = await fetch(proxyPath, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, model }),
      signal: abortRef.current?.signal,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || `Server error (${response.status})`);
    }

    // Parse SSE stream from the server proxy
    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';
    let fullText = '';

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
          if (text) {
            fullText += text;
            setReport(fullText);
          }
        } catch {
          // skip malformed chunks
        }
      }
    }
  };

  const cancelGeneration = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const reset = useCallback(() => {
    setReport('');
    setError('');
    setStatus('idle');
  }, []);

  const currentProvider = PROVIDERS[providerId];

  return {
    resume,
    setResume,
    focus,
    setFocus,
    timeRange,
    setTimeRange,
    reportLang,
    setReportLang,
    report,
    status,
    error,
    providerId,
    model,
    currentProvider,
    setModel: handleModelChange,
    setProviderId: handleProviderChange,
    generateReport,
    cancelGeneration,
    reset,
    isGenerating: status === 'generating',
  };
}
