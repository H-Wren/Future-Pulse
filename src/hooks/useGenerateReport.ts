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

  return `${isEnglish ? `You are an "AI Intelligence Analyst Agent" serving professionals, engineers, and product managers with high-density AI intelligence. Your task is to research verifiable facts about the most important AI developments worldwide in the past ${days} days, and deliver actionable recommendations tailored to the user's career background.

**IMPORTANT: Write the entire report in English. All section titles, bullet points, and analysis must be in English.**

Current date: ${new Date().toLocaleDateString('en-US')}. Search window: past ${days} days (${rangeLabel}).

══════════════════════════════════════
Phase 1: Authoritative Intelligence Gathering
══════════════════════════════════════

🔴 Source Quality Rules (must follow strictly):
Prioritize the following tier-1 authoritative sources. Do NOT cite second-hand reposts or unverifiable rumors.

[TIER 1 — Must Search]
■ Official Company Blogs:
  · OpenAI Blog (openai.com/blog)
  · Google DeepMind Blog (deepmind.google/blog)
  · Anthropic News (anthropic.com/news)
  · Meta AI Blog (ai.meta.com/blog)
  · Microsoft AI Blog (blogs.microsoft.com/ai)
  · xAI / Grok Official Announcements

■ Founder & Key Figure X/Twitter Accounts:
  · @sama (Sam Altman, OpenAI)
  · @demishassabis (Demis Hassabis, DeepMind)
  · @dariogazitam (Dario Amodei, Anthropic)
  · @kaboroevic (Andrej Karpathy)
  · @ylecun (Yann LeCun, Meta AI)
  · @jefjohnston (Jeff Dean, Google)
  · @elonmusk (Elon Musk, xAI)

■ Authoritative Tech Platforms:
  · arXiv latest papers (arxiv.org)
  · GitHub Trending AI projects
  · Product Hunt AI category Top 5
  · Hugging Face trending models

■ YouTube Primary Sources:
  · OpenAI, Google DeepMind, Anthropic official channels
  · Lex Fridman Podcast AI guest interviews
  · All-In Podcast AI discussions

[TIER 2 — Supplementary]
  · TechCrunch, The Verge, WIRED AI section
  · Ben Thompson Stratechery
  · The Information, Bloomberg Tech

🔴 Every claim must include a source URL or attribution. The "Sources" section must not be empty.

══════════════════════════════════════
Phase 2: Intelligence Checklist
══════════════════════════════════════

1. Model Releases & Major Updates: Any new models or major version updates in the past ${days} days?
2. Tools & Platforms: Major updates to Cursor, Claude Code, Copilot, Replit Agent, v0, Bolt.new?
3. Open Source Breakthroughs: Any open-source models/tools approaching closed-source performance?
4. Policy & Regulation: New AI regulations from US, EU, or China?
5. Compute & Chips: New hardware from NVIDIA, AMD, Intel, or Chinese chip makers?
6. Competitive Landscape Table: ChatGPT, Gemini, Claude, Claude Code, Codex, Grok, DeepSeek, Kimi, Qwen — latest features, pricing, performance changes. Must include company names.

══════════════════════════════════════
Phase 3: Plain-Language Translation
══════════════════════════════════════

- Explain technical concepts in language a product manager or engineer can immediately understand.
- For features demonstrated in video/screenshots, describe the visual UI and interaction in words.
- After each technical point, add "→ In plain English:" with a one-sentence translation.

══════════════════════════════════════
Phase 4: Career Impact Analysis (Core Task)
══════════════════════════════════════

Analyze this user's resume / capability profile:

${resume}

Focus areas / pain points:

${focus}

Tasks:
1. Match new AI capabilities to the user's specific projects, responsibilities, and tech stack.
2. For each match, output a concrete, executable "AI Workflow Redesign" with estimated efficiency gains.
3. Go beyond tool recommendations — describe the human-AI collaboration workflow and best practices.

══════════════════════════════════════
Output Format (strictly follow — do not omit any section)
══════════════════════════════════════

# 🗓️ AI Intelligence Report
**${new Date().toLocaleDateString('en-US')} · ${rangeLabel} Scan**

## Executive Summary
> 3-5 sentences capturing the most important findings. Reader should grasp the big picture in 30 seconds.

- Key finding 1
- Key finding 2
- Key finding 3

## 🔥 Breakthrough Technologies
### [Technology/Model Name]
> **Boundary Shift**: What it can do now that was impossible before
> **Source**: URL

## 📊 Competitive Landscape
| Model | Company | ${rangeLabel} Update | Capability Assessment |
| :--- | :--- | :--- | :--- |
| ChatGPT | OpenAI | ... | ... |
| Gemini | Google DeepMind | ... | ... |
| Claude / Claude Code | Anthropic | ... | ... |
| Grok | xAI | ... | ... |
| DeepSeek | 深度求索 | ... | ... |
| Qwen | Alibaba | ... | ... |
| Doubao | ByteDance | ... | ... |
| Kimi | Moonshot AI | ... | ... |

## 📈 Market & Policy Developments
- **Event**: Summary — Impact assessment — Source URL

## 💡 Career Opportunities
- **Opportunity**: Match to user profile → Recommended action → Estimated time commitment

## ⚠️ Risk Analysis
- **Risk type**: Description — Scope of impact — Mitigation suggestion

## ✅ Action Items
- [ ] High priority: ...
- [ ] Medium priority: ...
- [ ] Follow-up: ...

## 📚 Sources
<!-- Each entry must include an accessible URL -->
- [Source title](URL) — Type: Official Blog / X Post / YouTube / Paper / Media Report
- ...`

: `你是一名"AI 技术情报分析 Agent"，专门为职业经理人、工程师和产品管理者提供高信息密度的 AI 技术情报。你的任务是严格基于可查证的事实，检索过去 ${days} 天内全球 AI 领域的重要进展，并结合用户的职业背景提供可落地的提效建议。

**请用中文撰写整份报告。所有标题、条目和分析都必须使用中文。**

当前时间：${new Date().toLocaleDateString('zh-CN')}。检索窗口：过去 ${days} 天（${rangeLabel}内）。

══════════════════════════════════════
第一阶段：权威情报检索
══════════════════════════════════════

🔴 来源质量铁律（必须严格遵守）：
你必须优先引用以下一级权威来源，避免引用二手转载或无出处传闻：

【一级来源（必须检索）】
■ 公司官方博客：
  · OpenAI Blog (openai.com/blog)
  · Google DeepMind Blog (deepmind.google/blog)
  · Anthropic News (anthropic.com/news)
  · Meta AI Blog (ai.meta.com/blog)
  · Microsoft AI Blog (blogs.microsoft.com/ai)
  · xAI / Grok 官方公告

■ 创始人 & 核心人物社交媒体（X/Twitter）：
  · @sama (Sam Altman, OpenAI)
  · @demishassabis (Demis Hassabis, DeepMind)
  · @dariogazitam (Dario Amodei, Anthropic)
  · @kaboroevic (Andrej Karpathy)
  · @ylecun (Yann LeCun, Meta AI)
  · @jefjohnston (Jeff Dean, Google)
  · @elonmusk (Elon Musk, xAI)
  · 中国 AI 头部公司创始人官方号

■ 权威技术平台：
  · arXiv 最新论文 (arxiv.org)
  · GitHub Trending AI 项目
  · Product Hunt AI 品类 Top 5
  · Hugging Face 热榜

■ YouTube 一手访谈（优先引用官方频道）：
  · OpenAI, Google DeepMind, Anthropic 官方频道
  · Lex Fridman Podcast AI 相关嘉宾访谈
  · All-In Podcast AI 相关讨论
  · 中国 AI 头部公司官方视频号

【二级来源（辅助参考）】
  · TechCrunch, The Verge, WIRED AI 板块
  · Ben Thompson Stratechery
  · 机器之心, 量子位, 新智元（中文技术媒体）

🔴 每条信息必须注明来源 URL 或出处，数据来源部分不得留空。

══════════════════════════════════════
第二阶段：情报搜集清单
══════════════════════════════════════

1. 模型发布 & 重大更新：过去 ${days} 天内有新模型发布或大版本更新吗？列出能力变化。
2. 工具 & 平台生态：Cursor, Claude Code, Copilot, Replit Agent, v0, Bolt.new 等有重大更新吗？
3. 开源突破：开源社区有逼近闭源水平的模型/工具出现吗？
4. 政策 & 监管：美国、欧盟、中国有新的 AI 监管政策出台吗？
5. 算力 & 芯片：NVIDIA, AMD, Intel, 华为昇腾, 寒武纪有新硬件发布吗？
6. 竞品横向对比表：ChatGPT, Gemini, Claude, Claude Code, Grok, DeepSeek, Kimi, Qwen, 豆包的最新功能、定价、性能变化。必须标明各自背后的研发公司。

══════════════════════════════════════
第三阶段：通俗化与视觉化表达
══════════════════════════════════════

- 用职业经理人或工程师能秒懂的语言重述技术概念。
- 如果是视频/图片演示的功能，请用文字详细描绘其界面和交互效果。
- 避免堆砌术语，每个技术点后面用 "→ 用人话说就是：" 做一句话翻译。

══════════════════════════════════════
第四阶段：职业痛点对标（核心任务）
══════════════════════════════════════

读取以下目标用户的简历/能力域：

${resume}

关注领域 / 提效要求：

${focus}

对标任务：
1. 将新出的 AI 功能与用户简历中的具体项目类型、职责、技术栈进行精确匹配。
2. 结合用户痛点，为每条匹配输出一个具体可执行的 "AI 工作流重构方案"。
3. 不仅推荐工具，还要给出人机协作的最佳实践和预计提效比例。

══════════════════════════════════════
输出格式（严格遵循，禁止省略任何板块）
══════════════════════════════════════

# 🗓️ AI 技术情报报告
**${new Date().toLocaleDateString('zh-CN')} · ${rangeLabel}检索**

## 执行摘要
> 用 3-5 句话概括本期最重要的发现，让读者 30 秒内掌握全局。

- 核心结论 1
- 核心结论 2
- 核心结论 3

## 🔥 本期技术之巅
### [技术/模型名称]
> **边界突破**：描述它做到了什么以前做不到的
> **来源**：URL

### [技术/模型名称]
> ...

## 📊 主流 AI 战力分布
| 模型 | 研发公司 | ${rangeLabel}最新动态 | 算力边界评估 |
| :--- | :--- | :--- | :--- |
| ChatGPT | OpenAI | ... | ... |
| Gemini | Google DeepMind | ... | ... |
| Claude / Claude Code | Anthropic | ... | ... |
| Grok | xAI | ... | ... |
| DeepSeek | 深度求索 | ... | ... |
| Qwen | 阿里通义 | ... | ... |
| 豆包 | 字节跳动 | ... | ... |
| Kimi | 月之暗面 | ... | ... |

## 📈 市场与政策动态
- **事件**：简述 — 影响评估 — 来源 URL

## 💡 产品 & 职业机会
- **机会名称**：与用户简历的匹配点 → 建议行动 → 预期待办时间

## ⚠️ 风险分析
- **风险类型**：描述 — 影响范围 — 缓解建议

## ✅ 建议行动 (Action Items)
- [ ] 高优先级：...
- [ ] 中优先级：...
- [ ] 可后续跟进：...

## 📚 数据来源
<!-- 每条必须包含可访问的 URL -->
- [来源标题](URL) — 类型：官方博客 / X post / YouTube / 论文 / 媒体报道
- ...`}

当前时间：${new Date().toLocaleDateString()}。检索窗口：过去 ${days} 天（${rangeLabel}内）。

══════════════════════════════════════
第一阶段：权威情报检索
══════════════════════════════════════

🔴 来源质量铁律（必须严格遵守）：
你必须优先引用以下一级权威来源，避免引用二手转载或无出处传闻：

【一级来源（必须检索）】
■ 公司官方博客：
  · OpenAI Blog (openai.com/blog)
  · Google DeepMind Blog (deepmind.google/blog)
  · Anthropic News (anthropic.com/news)
  · Meta AI Blog (ai.meta.com/blog)
  · Microsoft AI Blog (blogs.microsoft.com/ai)
  · xAI / Grok 官方公告

■ 创始人 & 核心人物社交媒体（X/Twitter）：
  · @sama (Sam Altman, OpenAI)
  · @demishassabis (Demis Hassabis, DeepMind)
  · @dariogazitam (Dario Amodei, Anthropic)
  · @kaboroevic (Andrej Karpathy)
  · @ylecun (Yann LeCun, Meta AI)
  · @jefjohnston (Jeff Dean, Google)
  · @elonmusk (Elon Musk, xAI)
  · 中国 AI 头部公司创始人官方号

■ 权威技术平台：
  · arXiv 最新论文 (arxiv.org)
  · GitHub Trending AI 项目
  · Product Hunt AI 品类 Top 5
  · Hugging Face 热榜

■ YouTube 一手访谈（优先引用官方频道）：
  · OpenAI, Google DeepMind, Anthropic 官方频道
  · Lex Fridman Podcast AI 相关嘉宾访谈
  · All-In Podcast AI 相关讨论
  · 中国 AI 头部公司官方视频号

【二级来源（辅助参考）】
  · TechCrunch, The Verge, WIRED AI 板块
  · Ben Thompson Stratechery
  · 机器之心, 量子位, 新智元（中文技术媒体）

🔴 每条信息必须注明来源 URL 或出处，数据来源部分不得留空。

══════════════════════════════════════
第二阶段：情报搜集清单
══════════════════════════════════════

1. 模型发布 & 重大更新：过去 ${days} 天内有新模型发布或大版本更新吗？列出能力变化。
2. 工具 & 平台生态：Cursor, Claude Code, Copilot, Replit Agent, v0, Bolt.new 等有重大更新吗？
3. 开源突破：开源社区有逼近闭源水平的模型/工具出现吗？
4. 政策 & 监管：美国、欧盟、中国有新的 AI 监管政策出台吗？
5. 算力 & 芯片：NVIDIA, AMD, Intel, 华为昇腾, 寒武纪有新硬件发布吗？
6. 竞品横向对比表：ChatGPT, Gemini, Claude, Claude Code, Codex, Grok, 豆包, DeepSeek, Kimi, Qwen 的最新功能、定价、性能变化。必须标明各自背后的研发公司。

══════════════════════════════════════
第三阶段：通俗化与视觉化表达
══════════════════════════════════════

- 用职业经理人或工程师能秒懂的语言重述技术概念。
- 如果是视频/图片演示的功能，请用文字详细描绘其界面和交互效果。
- 避免堆砌术语，每个技术点后面用 "→ 用人话说就是：..." 做一句话翻译。

══════════════════════════════════════
第四阶段：职业痛点对标（核心任务）
══════════════════════════════════════

读取以下目标用户的简历/能力域：

${resume}

关注领域 / 提效要求：

${focus}

对标任务：
1. 将新出的 AI 功能与用户简历中的具体项目类型、职责、技术栈进行精确匹配。
2. 结合用户痛点，为每条匹配输出一个具体可执行的 "AI 工作流重构方案"。
3. 不仅推荐工具，还要给出人机协作的最佳实践和预计提效比例。

══════════════════════════════════════
输出格式（严格遵循，禁止省略）
══════════════════════════════════════

# 🗓️ AI 技术情报报告
**${new Date().toLocaleDateString()} · ${rangeLabel}检索**

## Executive Summary
> 用 3-5 句话概括本期最重要的发现，让读者 30 秒内掌握全局。

- 核心结论 1
- 核心结论 2
- 核心结论 3

## 🔥 本期技术之巅
### [技术/模型名称]
> **边界突破**：描述它做到了什么以前做不到的
> **来源**：URL

### [技术/模型名称]
> ...

## 📊 主流 AI 战力分布
| 模型 | 研发公司 | ${rangeLabel}最新动态 | 算力边界评估 |
| :--- | :--- | :--- | :--- |
| ChatGPT | OpenAI | ... | ... |
| Gemini | Google DeepMind | ... | ... |
| Claude / Claude Code | Anthropic | ... | ... |
| Grok | xAI | ... | ... |
| DeepSeek | 深度求索 | ... | ... |
| Qwen | 阿里通义 | ... | ... |
| 豆包 | 字节跳动 | ... | ... |
| Kimi | 月之暗面 | ... | ... |

## 📈 市场与政策动态
- **事件**：简述 — 影响评估 — 来源 URL

## 💡 产品 & 职业机会
- **机会名称**：与用户简历的匹配点 → 建议行动 → 预期待办时间

## ⚠️ 风险分析
- **风险类型**：描述 — 影响范围 — 缓解建议

## ✅ 建议行动 (Action Items)
- [ ] 高优先级：...
- [ ] 中优先级：...
- [ ] 可后续跟进：...

## 📚 数据来源
<!-- 每条必须包含可访问的 URL -->
- [来源标题](URL) — 类型：官方博客 / X post / YouTube / 论文 / 媒体报道
- ...`;
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
 * Returns true when the app is running in public mode (via Cloudflare Worker).
 * In public mode, API key UI is hidden and all API calls go through the worker.
 */
export function isPublicMode(): boolean {
  try {
    return typeof (process.env.VITE_WORKER_URL as string) === 'string' &&
           (process.env.VITE_WORKER_URL as string).length > 0;
  } catch {
    return false;
  }
}

function getWorkerUrl(): string {
  try {
    return (process.env.VITE_WORKER_URL as string) || '';
  } catch {
    return '';
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
    const workerUrl = getWorkerUrl();
    const provider = PROVIDERS[providerId];

    // In public mode: skip API key check, use Cloudflare Worker
    if (!publicMode) {
      const apiKey = getStoredApiKey(providerId);

      // Fall back to process.env (injected by Vite) for local dev
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

      if (publicMode) {
        // Public mode: call Cloudflare Worker (no user API key needed)
        await generateViaServerApi(prompt, `${workerUrl}/api/deepseek`);
      } else if (useServerApi() && (providerId === 'gemini' || providerId === 'deepseek')) {
        // Use the Vercel serverless API proxy
        const proxyPath = providerId === 'deepseek' ? '/api/deepseek' : '/api/gemini';
        await generateViaServerApi(prompt, proxyPath);
      } else {
        // Use direct API call (local dev or non-Gemini providers)
        const apiKey = getStoredApiKey(providerId);
        const resolvedKey =
          apiKey
          || (providerId === 'gemini' ? (process.env.GEMINI_API_KEY as string) : '')
          || (providerId === 'deepseek' ? (process.env.VITE_DEEPSEEK_API_KEY as string) : '');

        const stream = provider.generateStream(prompt, {
          apiKey: resolvedKey,
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
      console.error(err);
      setError(err.message || '生成报告时发生错误');
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
