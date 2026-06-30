# Future Pulse — AI 算力边界情报站

**AI 技术趋势智能监控平台** — 结合个人技能画像，自动生成四阶段情报分析报告，帮你把握 AI 算力边界与工作流重构机会。

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-在线访问-2e4a2a)](https://h-wren.github.io/Future-Pulse/)
[![Vercel](https://img.shields.io/badge/Vercel-备用部署-black)](https://future-pulse-six.vercel.app/)

---

## ✨ 核心功能

- **🔍 四阶段情报工作流** — 算力边界 → 工具动态 → 技能重构 → 行动路线图
- **📡 权威信源聚合** — 官方博客、创始人 X/Twitter、YouTube 频道、arXiv 论文
- **📄 PDF 简历上传** — 客户端本地解析，无需后端，隐私安全
- **⏱️ 时间范围选择** — 3 天 / 1 周 / 1 个月 / 3 个月，灵活调整情报跨度
- **🌐 双语报告** — 中文 / English 报告输出，UI 完整国际化
- **🎨 Editorial Forest 设计** — 森林绿 + 尘埃粉 + 暖奶油，Source Serif 衬线字体
- **🌙 暗色模式** — 自动跟随系统，支持手动切换
- **📝 流式输出** — 实时查看 AI 生成过程
- **📚 历史记录** — IndexedDB 本地持久化，浏览、加载、删除
- **📤 导出能力** — Markdown / 纯文本 / 剪贴板
- **🔑 多 Provider** — DeepSeek（默认）/ Gemini / OpenAI / Claude

## 🚀 快速开始

```bash
npm install
cp .env.example .env.local   # 填入 DEEPSEEK_API_KEY
npm run dev                   # http://localhost:3000
```

无需 VPN。默认使用 DeepSeek API（`api.deepseek.com`），国内直连。

## 🌍 公开访问

| 地址 | 国内免 VPN | 说明 |
|------|-----------|------|
| **[h-wren.github.io/Future-Pulse](https://h-wren.github.io/Future-Pulse/)** | ✅ 推荐 | GitHub Pages 静态托管 |
| [future-pulse-six.vercel.app](https://future-pulse-six.vercel.app/) | ❌ 需 VPN | Vercel 全球 CDN |

在页面右上角 🔑 输入你的 DeepSeek API Key 即可使用。

> 📌 **获取 API Key**：[platform.deepseek.com](https://platform.deepseek.com/) → API Keys → 创建，免费额度足够日常使用。

## 📦 部署

### GitHub Pages（推荐）

已配置 `base: '/Future-Pulse/'`，构建后推送 `gh-pages` 分支即可。

```bash
npm run build
# 将 dist/ 内容推送到 gh-pages 分支
```

### Vercel

```bash
npm run build
vercel --prod
```

环境变量：`DEEPSEEK_API_KEY`（用于 `/api/deepseek` 服务端代理）

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 19 + TypeScript 5.8 |
| 构建 | Vite 6 |
| 样式 | Tailwind CSS 4 + CSS 变量 |
| 动画 | Motion (Framer Motion) |
| 图标 | Lucide React |
| AI API | DeepSeek / Gemini / OpenAI |
| Markdown | react-markdown + remark-gfm |
| PDF 解析 | pdfjs-dist（本地 Worker） |
| 存储 | IndexedDB（idb-keyval） |
| 字体 | Source Serif 4 + JetBrains Mono + LXGW WenKai |

## 📁 项目结构

```
src/
  components/
    Header.tsx                   — 顶栏：品牌 + 语言/主题切换
    ApiKeyModal.tsx              — API Key 管理弹窗
    HistoryPanel.tsx             — 历史报告抽屉
    ExportMenu.tsx               — 导出菜单
    layout/MainLayout.tsx        — 响应式网格布局
    sidebar/UserProfilePanel.tsx — 侧边栏：简历/PDF上传/时间范围/语言
    output/
      ReportOutput.tsx           — 报告容器
      ReportContent.tsx          — Markdown 渲染
      ReportEmptyState.tsx       — 空状态引导
      ReportLoadingState.tsx     — 骨架屏加载
      ReportErrorState.tsx       — 错误 + 重试
  hooks/
    useGenerateReport.ts         — 核心生成逻辑 + Prompt 构建
    useLocale.ts                 — i18n Hook
  i18n/
    zh.ts / en.ts / index.ts     — 中英文字典
  utils/
    providers.ts                 — AI Provider 抽象层
    storage.ts                   — IndexedDB 封装
    pdf.ts                       — PDF 文本提取
    ThemeContext.tsx              — 暗色模式上下文
  types/
    report.ts                    — TypeScript 类型
api/
  deepseek.ts                    — Vercel 服务端代理
  gemini.ts                      — Vercel 服务端代理
```

## 🔒 隐私

- API Key 存储在浏览器 localStorage，仅用于你的请求
- PDF 文件在客户端本地解析，不上传服务器
- 无后端数据库，无用户追踪

## 📄 License

MIT
