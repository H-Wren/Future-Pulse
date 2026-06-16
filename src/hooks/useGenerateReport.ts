import { useState, useCallback, useRef } from 'react';
import { PROVIDERS, getStoredApiKey, getStoredModel, storeModel } from '../utils/providers';
import type { ProviderId } from '../utils/providers';
import type { ReportStatus } from '../types/report';

const DEFAULT_RESUME = `核心能力与经验：
1. 具备全链路及项目闭环管理经验，主导多项重点工程。
2. 技术驱动的产品化能力：整合自动化工具与AI模型重构生产流，实现效能显著提升并解决转码痛点和跨平台协作问题。
3. 项目管理与跨部门协同：统筹管理多个战略项目，在并行状态下实现从研发、质控到交付的零误差闭环。
4. 品牌赋能与跨文化产品洞察：擅长国际化产品叙事重构与元数据优化，提升B端采购转化率并推动产品打入顶级机构。
5. 技能与工具：精通行业工具与专业及合规标准；深入使用与整合 LLMs 等 AI 工具进行业务管线提效。
（您可以将真实简历内容粘贴至此）`;

const DEFAULT_FOCUS = '产品管理转型、工作流提效、结构化思维赋能';

function buildPrompt(resume: string, focus: string): string {
  return `
你是一个部署在 AI Studio 上的"AI 技术与算力边界监控 Agent"。你的任务是利用搜索实时联网功能，每周为用户整理全球最前沿的 AI 进展，并结合用户的简历提供提效建议。

当前时间：${new Date().toLocaleDateString()}（请重点检索过去 7 天内最新的 AI 动态）。

第一阶段：联网情报收集
1. 搜索范围：重点检索过去 7 天内 Twitter (X)、YouTube、OpenAI Blog、Google DeepMind Blog、Anthropic News 的热点。
2. 算力边界定义：不仅要报告"出了什么"，还要解释"它能做什么以前做不到的事"。
3. 竞品对比表：横向对比 ChatGPT, Gemini, Claude, Claude Code, Codex, Grok, 豆包, DeepSeek。必须标明它们背后的研发公司，并列出本周的核心更新或独家绝活。

第二阶段：通俗化表达
- 视觉化描述：在描述功能时，请用文字详细描绘该功能在视频/图片中呈现的效果。
- 极简语言：去除学术术语，用职业经理人或工程师能秒懂的语言。

第三阶段：职业痛点对标 (核心任务)
1. 读取以下目标用户的简历或能力域资产：
${resume}

2. 关注领域 / 提效要求：
${focus}

3. 识别场景：将新出的 AI 功能与用户简历中的具体项目、职责、技术栈进行匹配。结合用户的"提效要求"和痛点诉求，为用户专属定制提效和业务重构方案。
4. 流程重构：不仅是推荐工具，要给出一个具体的"AI 工作流"。

输出格式必须严格遵循以下 Markdown 模板。

# 🗓️ AI 算力边界周报 (更新于: {{date}})

### 🌟 本周技术之巅 (突破了什么？)
* **[技术名]**：[描述] - **边界突破**：[以前做不到，现在能做的]

### ⚔️ 主流 AI 战力分布 (功能横评)
| 模型 | 所属公司 | 本周更新 / 独有绝活 | 算力边界描述 |
| :--- | :--- | :--- | :--- |
| Gemini | Google | ... | ... |
| ChatGPT | OpenAI | ... | ... |
| Claude | Anthropic | ... | ... |
| Claude Code | Anthropic | ... | ... |
| Codex | OpenAI | ... | ... |
| Grok | xAI | ... | ... |
| 豆包 | 字节跳动 | ... | ... |
| DeepSeek | 深度求索 | ... | ... |

### 🛠️ 专属 AI 提效与重构方案 (精准对标需求)
#### 匹配场景 A：[简历中的某个项目/职责/技能重点]
- **新功能应用**：[具体功能]
- **操作流程**：[Step 1 -> Step 2]
- **核心价值**：[具体量化的效果 / 赋能增长点]

### 📈 本周趋势总结
[基于上述的技术更新与迭代，总结行业目前正在发生的底层逻辑变化、流行应用趋势，以及如何影响知识工作者和产品构建者的范式变迁。]
`;
}

export function useGenerateReport() {
  const [resume, setResume] = useState(DEFAULT_RESUME);
  const [focus, setFocus] = useState(DEFAULT_FOCUS);
  const [report, setReport] = useState('');
  const [status, setStatus] = useState<ReportStatus>('idle');
  const [error, setError] = useState('');
  const [providerId, setProviderId] = useState<ProviderId>('gemini');
  const [model, setModel] = useState(PROVIDERS.gemini.defaultModel);
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

    const provider = PROVIDERS[providerId];
    const apiKey = getStoredApiKey(providerId);

    // For Gemini, fall back to process.env.GEMINI_API_KEY
    const resolvedKey =
      apiKey || (providerId === 'gemini' ? (process.env.GEMINI_API_KEY as string) : '');

    if (!resolvedKey && providerId === 'gemini') {
      setError('GEMINI_API_KEY 未配置。请在 .env 文件中设置，或通过"配置 API Key"输入。');
      setStatus('error');
      return;
    }

    if (!resolvedKey) {
      setError(`请在设置中配置 ${provider.name} 的 API Key。`);
      setStatus('error');
      return;
    }

    setStatus('generating');
    setError('');
    setReport('');

    abortRef.current = new AbortController();

    try {
      const prompt = buildPrompt(resume, focus);
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
  }, [resume, focus, providerId, model]);

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
