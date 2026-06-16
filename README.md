# Future Pulse — AI 算力监控与产品重构 Agent

AI Compute Boundary Monitor — 结合个人画像实现全天候生产力智能提效与工作流重构。

## 快速开始

```bash
npm install
cp .env.example .env.local   # 填入 GEMINI_API_KEY
npm run dev                   # 访问 http://localhost:3000
```

## 功能特性

- **多 AI 模型支持** — Gemini / OpenAI / Claude / DeepSeek / Moonshot
- **联网情报收集** — 通过 Google Search 实时检索全球 AI 动态
- **个人化报告** — 结合简历与焦点自动生成专属 AI 提效方案
- **历史记录** — 本地持久化存储，支持浏览、加载、删除
- **导出能力** — Markdown / 纯文本 / 剪贴板 / 打印 PDF
- **暗色模式** — 自动跟随系统 + 手动切换
- **国际化** — 中文 / English 双语界面
- **流式输出** — 实时查看报告生成过程
- **API Key 管理** — 浏览器端安全存储，支持多 Provider

## 部署到 Vercel

1. 推送代码到 GitHub 仓库
2. 在 [vercel.com](https://vercel.com) 导入该仓库
3. 设置环境变量：
   - `GEMINI_API_KEY` — 你的 Gemini API Key
4. 框架自动识别为 Vite，保留默认构建配置
5. 点击 Deploy，等待部署完成
6. （可选）绑定自定义域名

### API Key 安全建议

在 [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → API 密钥中设置：
1. HTTP 引用来源限制：`https://你的域名/*` 和 `http://localhost:3000/*`
2. 仅启用 Generative Language API 服务
3. 定期轮换密钥（建议 1-3 个月）

## 技术栈

React 19 / TypeScript 5.8 / Vite 6 / Tailwind CSS 4 / Motion / Lucide Icons

## 环境变量

| 变量 | 说明 | 必填 |
|------|------|------|
| `GEMINI_API_KEY` | Google Gemini API 密钥 | 是（如使用 Gemini） |

## 项目结构

```
src/
  components/
    Header.tsx              — 顶栏 + 主题/语言切换
    ApiKeyModal.tsx         — API Key 配置弹窗
    HistoryPanel.tsx        — 历史报告抽屉
    ExportMenu.tsx          — 导出菜单
    layout/MainLayout.tsx   — 响应式网格布局
    sidebar/UserProfilePanel.tsx — 左侧配置面板
    output/
      ReportOutput.tsx      — 报告输出容器
      ReportContent.tsx     — Markdown 渲染
      ReportEmptyState.tsx  — 空状态
      ReportLoadingState.tsx — 骨架屏加载
      ReportErrorState.tsx  — 错误状态
  hooks/
    useGenerateReport.ts    — 报告生成逻辑
    useLocale.ts            — 国际化 Hook
  utils/
    providers.ts            — AI Provider 抽象层
    storage.ts              — IndexedDB 存储
    ThemeContext.tsx         — 暗色模式上下文
  i18n/
    zh.ts / en.ts / index.ts — 国际化字典
  types/
    report.ts               — 类型定义
```
