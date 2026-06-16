import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Loader2, 
  Search, 
  FileText, 
  Target, 
  Zap, 
  RefreshCw, 
  Cpu,
  UserCircle
} from 'lucide-react';

const defaultResume = `核心能力与经验：
1. 具备全链路及项目闭环管理经验，主导多项重点工程。
2. 技术驱动的产品化能力：整合自动化工具与AI模型重构生产流，实现效能显著提升并解决转码痛点和跨平台协作问题。
3. 项目管理与跨部门协同：统筹管理多个战略项目，在并行状态下实现从研发、质控到交付的零误差闭环。
4. 品牌赋能与跨文化产品洞察：擅长国际化产品叙事重构与元数据优化，提升B端采购转化率并推动产品打入顶级机构。
5. 技能与工具：精通行业工具与专业及合规标准；深入使用与整合 LLMs 等 AI 工具进行业务管线提效。
（您可以将真实简历内容粘贴至此）`;

const defaultFocus = "产品管理转型、工作流提效、结构化思维赋能";

export default function App() {
  const [resume, setResume] = useState(defaultResume);
  const [focus, setFocus] = useState(defaultFocus);
  const [report, setReport] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');

  const generateReport = async () => {
    if (!resume.trim() || !focus.trim()) return;
    
    setIsGenerating(true);
    setError('');
    setReport('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `
你是一个部署在 AI Studio 上的“AI 技术与算力边界监控 Agent”。你的任务是利用 Google Search 实时联网功能，每周为用户整理全球最前沿的 AI 进展，并结合用户的简历提供提效建议。

当前时间：${new Date().toLocaleDateString()}（请重点检索过去 7 天内最新的 AI 动态）。

第一阶段：联网情报收集 (Grounding)
1. 搜索范围：重点检索过去 7 天内 Twitter (X)、YouTube、OpenAI Blog、Google DeepMind Blog、Anthropic News 的热点。
2. 算力边界定义：不仅要报告“出了什么”，还要解释“它能做什么以前做不到的事”。
3. 竞品对比表：横向对比 ChatGPT, Gemini, Claude, Claude Code, Codex, Grok, 豆包, DeepSeek。必须标明它们背后的研发公司，并列出本周的核心更新或独家绝活。

第二阶段：通俗化表达
- 视觉化描述：在描述功能时，请用文字详细描绘该功能在视频/图片中呈现的效果。
- 极简语言：去除学术术语，用职业经理人或工程师能秒懂的语言。

第三阶段：职业痛点对标 (核心任务)
1. 读取以下目标用户的简历或能力域资产：
${resume}

2. 关注领域 / 提效要求：
${focus}

3. 识别场景：将新出的 AI 功能与用户简历中的具体项目、职责、技术栈进行匹配。结合用户的“提效要求”和痛点诉求，为用户专属定制提效和业务重构方案。
4. 流程重构：不仅是推荐工具，要给出一个具体的“AI 工作流”。

输出格式必须严格遵循以下 Markdown 模板。请不要在标题中包含用户的真实姓名（使用“目标用户”或“专属”即可）。

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

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        }
      });

      let fullText = '';
      for await (const chunk of responseStream) {
        fullText += chunk.text;
        setReport(fullText);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while generating the report.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-2.5 rounded-xl shadow-sm">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-900">
                Future Pulse <span className="font-medium text-zinc-400 text-sm ml-2">v2.0</span>
              </h1>
              <p className="text-xs text-zinc-500 font-medium tracking-wide uppercase mt-0.5">
                AI 算力监控与产品重构 Agent
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            System Online & Grounded
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar - Configuration */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
              <div className="p-4 border-b border-zinc-100 bg-zinc-50/80 flex items-center gap-2">
                <UserCircle className="w-5 h-5 text-indigo-600" />
                <h2 className="font-semibold text-zinc-800 text-sm tracking-wide">用户核心资产分析 (Profile)</h2>
              </div>
              
              <div className="p-5 space-y-6">
                <div className="space-y-2.5">
                  <label className="flex items-center justify-between text-sm font-semibold text-zinc-800">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-zinc-400" />
                      当前简历能力域
                    </div>
                  </label>
                  <textarea
                    value={resume}
                    onChange={(e) => setResume(e.target.value)}
                    className="w-full h-56 p-3 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none shadow-inner leading-relaxed"
                    placeholder="粘贴您的简历内容..."
                  />
                </div>

                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
                    <Target className="w-4 h-4 text-zinc-400" />
                    本轮提效与重构焦点
                  </label>
                  <textarea
                    value={focus}
                    onChange={(e) => setFocus(e.target.value)}
                    rows={2}
                    className="w-full p-3 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none shadow-inner leading-relaxed"
                    placeholder="例如：产品经理转型、编校准确、项目管理、品牌效应"
                  />
                </div>

                <button
                  onClick={generateReport}
                  disabled={isGenerating || !resume.trim() || !focus.trim()}
                  className="w-full group relative flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white py-3.5 px-4 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
                      正在接入全球 AI 数据流...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                      生成算力边界专属报告
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Content - Report Output */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 flex-1 flex flex-col min-h-[700px] overflow-hidden">
              <div className="p-4 border-b border-zinc-100 bg-zinc-50/80 flex items-center justify-between shadow-sm z-10 relative">
                <div className="flex items-center gap-2">
                  <RefreshCw className={`w-4 h-4 text-indigo-600 ${isGenerating ? 'animate-spin' : ''}`} />
                  <h2 className="font-semibold text-zinc-800 text-sm tracking-wide">情报终端输出 (Intelligence Console)</h2>
                </div>
                {report && !isGenerating && (
                  <span className="text-[11px] uppercase tracking-wider font-bold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-md">
                    分析完成
                  </span>
                )}
              </div>
              
              <div className="p-6 lg:p-10 flex-1 overflow-auto bg-white">
                {error ? (
                  <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-100 shadow-sm flex items-start gap-3">
                    <div className="bg-red-100 p-1 rounded">❌</div>
                    <span className="pt-0.5">{error}</span>
                  </div>
                ) : report ? (
                  <div className="prose prose-zinc prose-sm sm:prose-base max-w-none 
                    prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-zinc-900
                    prose-h1:text-2xl prose-h1:border-b prose-h1:border-zinc-100 prose-h1:pb-4 prose-h1:mb-8
                    prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-4 prose-h3:flex prose-h3:items-center prose-h3:gap-2
                    prose-h4:text-base prose-h4:text-indigo-900 prose-h4:font-semibold prose-h4:mt-6 prose-h4:mb-3
                    prose-p:text-zinc-600 prose-p:leading-relaxed
                    prose-strong:text-zinc-900 prose-strong:font-semibold
                    prose-ul:my-4 prose-li:text-zinc-600 prose-li:marker:text-indigo-400
                    prose-table:w-full prose-table:border-collapse prose-table:text-sm prose-table:my-6
                    prose-th:bg-zinc-50/80 prose-th:p-3 prose-th:border prose-th:border-zinc-200 prose-th:text-left prose-th:text-zinc-800 prose-th:font-semibold
                    prose-td:p-3 prose-td:border prose-td:border-zinc-200 prose-td:text-zinc-600 prose-td:align-top
                    prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-indigo-800">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {report}
                    </ReactMarkdown>
                  </div>
                ) : isGenerating ? (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-6 py-20">
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-zinc-100 rounded-2xl rotate-45 transform"></div>
                      <div className="w-20 h-20 border-4 border-indigo-600/80 rounded-2xl rotate-45 transform border-t-transparent animate-spin absolute top-0 left-0"></div>
                      <Search className="w-6 h-6 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-sm font-medium text-zinc-600 tracking-wide">
                        正在调用 Google Search API 构建情报网...
                      </p>
                      <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                        分析全球 AI 产品迭代动态，并运用 Gemini 模型与您的产品经理转型蓝图进行深度对齐。
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-5 py-20">
                    <div className="w-20 h-20 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center justify-center shadow-inner rotate-3 transition-transform hover:rotate-6 shadow-sm">
                      <Target className="w-8 h-8 text-zinc-300" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-zinc-500 tracking-wide">
                        终端已就绪，等待获取指令
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
