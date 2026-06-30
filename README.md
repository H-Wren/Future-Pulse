# Future Pulse — AI 算力边界情报站

**AI 技术趋势智能监控平台** — 结合个人技能画像，自动生成情报分析报告，帮你把握 AI 算力边界与工作流重构机会。

[![GitHub Pages](https://img.shields.io/badge/在线访问-GitHub%20Pages-2e4a2a)](https://h-wren.github.io/Future-Pulse/)

---

## ✨ 功能

- **📡 权威信源聚合** — 官方博客、创始人 X/Twitter、arXiv 论文、GitHub Trending
- **📄 PDF 简历上传** — 客户端本地解析，隐私安全
- **⏱️ 时间范围选择** — 3 天 / 1 周 / 1 个月 / 3 个月
- **🌐 双语报告** — 中文 / English，UI 完整国际化
- **📝 流式输出** — 实时查看 AI 生成过程
- **📤 报告导出** — Markdown / 纯文本 / 剪贴板
- **🎨 Editorial Forest 设计** — 森林绿 + 尘埃粉 + Source Serif 衬线字体
- **🌙 暗色模式** — 自动跟随系统 + 手动切换
- **🔑 零配置使用** — 打开即用，无需自备 API Key

## 🌍 访问

**[h-wren.github.io/Future-Pulse](https://h-wren.github.io/Future-Pulse/)** — 国内免 VPN，打开即用。

## 🚀 本地开发

```bash
npm install
cp .env.example .env.local   # 填入 DEEPSEEK_API_KEY
npm run dev                   # http://localhost:3000
```

## 📦 部署

### GitHub Pages（当前方案）

```bash
# 设置环境变量
echo "VITE_PUBLIC_MODE=true" > .env
echo "VITE_DEEPSEEK_API_KEY=sk-xxx" >> .env

# 构建并部署
npm run build
# 将 dist/ 推送到 gh-pages 分支
```

### Vercel（备用）

```bash
vercel --prod
# 环境变量：DEEPSEEK_API_KEY
```

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 19 + TypeScript 5.8 |
| 构建 | Vite 6 |
| 样式 | Tailwind CSS 4 |
| 动画 | Motion |
| AI | DeepSeek API（默认） |
| Markdown | react-markdown + remark-gfm |
| PDF | pdfjs-dist（本地 Worker） |
| 部署 | GitHub Pages + gh-pages |

## 📁 项目结构

```
src/
  components/
    Header.tsx                   — 顶栏：品牌 + 语言/主题切换
    ApiKeyModal.tsx              — API Key 管理弹窗（本地开发用）
    ExportMenu.tsx               — 导出菜单
    layout/MainLayout.tsx        — 响应式网格布局
    sidebar/UserProfilePanel.tsx — 侧边栏：简历 / PDF上传 / 时间范围 / 语言
    output/
      ReportOutput.tsx           — 报告容器
      ReportContent.tsx          — Markdown 渲染
      ReportEmptyState.tsx       — 空状态
      ReportLoadingState.tsx     — 加载骨架屏
      ReportErrorState.tsx       — 错误 + 重试
  hooks/
    useGenerateReport.ts         — 生成逻辑 + Prompt 构建
    useLocale.ts                 — i18n
  i18n/
    zh.ts / en.ts / index.ts     — 中英文字典
  utils/
    providers.ts                 — AI Provider 抽象层
    pdf.ts                       — PDF 文本提取
    ThemeContext.tsx              — 暗色模式上下文
  types/
    report.ts                    — 类型定义
api/
  deepseek.ts                    — Vercel Serverless 代理
worker/
  worker.js                      — Cloudflare Worker 代理
```

## 🔒 隐私

- PDF 文件在客户端本地解析，不上传
- 无后端数据库，无用户追踪

## 📄 License

MIT
