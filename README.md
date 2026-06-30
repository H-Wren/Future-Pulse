# Future Pulse — Personal AI Intelligence Cockpit

Future Pulse 是一个个人 AI 技术情报与机会匹配工作台。它不是面向大众的 AI 周报 SaaS，而是把固定信源、个人能力画像、时间范围和报告结构产品化，用来持续追踪 AI 技术变化，并把变化转译成可执行的学习、项目和职业行动。

> Portfolio note: this project demonstrates AI workflow productization, frontend implementation, prompt architecture, local PDF parsing, bilingual UI, deployment security, and a calm editorial interface system.

## Product Positioning

普通 LLM 已经可以生成“一份 AI 周报”。Future Pulse 的价值不在于替代聊天框，而在于把一个长期重复的个人工作流固定下来：

- 保存个人能力画像、关注方向和报告结构
- 按 3 天 / 1 周 / 1 个月 / 3 个月生成不同粒度的技术情报
- 将 AI 进展映射到个人机会、能力差距和下一步行动
- 支持中英文报告、PDF 简历本地解析和 Markdown 导出
- 用统一 UI 降低每次整理情报的上下文切换成本

## What It Demonstrates

- **AI workflow productization**: 把 prompt、用户画像、时间范围和输出格式封装成可重复使用的工作台
- **Personalization layer**: 简历 / 技能 / 关注领域参与报告生成，而不是通用新闻摘要
- **Local-first privacy**: PDF 在浏览器本地解析，无数据库、无用户追踪
- **Provider abstraction**: DeepSeek / Gemini / OpenAI / Claude / Moonshot 的统一调用接口
- **Secure deployment boundary**: 公开部署不把 API Key 打进前端；需要通过 Worker 或 Serverless 代理
- **Editorial interface design**: 森林绿、暖纸色、衬线标题和紧凑控制台布局

## Features

- 权威信源提示：官方博客、创始人 X/Twitter、arXiv、GitHub Trending、Hugging Face
- PDF 简历上传：客户端本地解析，提取后合并到个人画像
- 时间范围选择：3 天 / 1 周 / 1 个月 / 3 个月
- 双语报告：中文 / English
- 流式输出：实时查看生成过程
- 导出能力：Markdown / 纯文本 / 剪贴板 / 打印 PDF
- 暗色模式：自动跟随系统 + 手动切换
- API Key 管理：本地开发可在浏览器端保存自己的 Provider Key

## Local Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

默认本地端口：

```text
http://localhost:3000
```

本地开发可以使用两种方式：

- 在 `.env.local` 中配置服务端 Key，例如 `DEEPSEEK_API_KEY`
- 或在应用内打开 API Key 配置弹窗，填入自己的 Provider Key

## Deployment Notes

This is primarily a personal workflow and portfolio project. If deployed publicly, do not expose your private model API key in frontend JavaScript.

### GitHub Pages

GitHub Pages 是静态托管，不能安全保存服务端密钥。公开部署时应使用 Cloudflare Worker 代理：

```bash
# .env
VITE_PUBLIC_MODE=true
VITE_WORKER_URL=https://your-worker.workers.dev

npm run build
```

Then publish `dist/` to the `gh-pages` branch.

### Vercel

Vercel 可使用 Serverless Functions 保存服务端密钥：

```bash
vercel --prod
```

Required environment variable:

```text
DEEPSEEK_API_KEY=...
```

## API Key Policy

- Personal/local use: using your own DeepSeek quota is acceptable.
- Public portfolio demo: use strict limits or disable generation if you do not want to pay for anonymous usage.
- Never commit `.env` or expose `VITE_DEEPSEEK_API_KEY` in a public build.
- If a key has ever appeared in built frontend assets, rotate it immediately.

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 + TypeScript 5.8 |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 |
| Animation | Motion |
| AI | DeepSeek API by default, multi-provider abstraction |
| Markdown | react-markdown + remark-gfm |
| PDF | pdfjs-dist local worker |
| Optional proxy | Cloudflare Worker / Vercel Serverless |

## Project Structure

```text
src/
  components/
    Header.tsx
    ApiKeyModal.tsx
    ExportMenu.tsx
    layout/MainLayout.tsx
    sidebar/UserProfilePanel.tsx
    output/
      ReportOutput.tsx
      ReportContent.tsx
      ReportEmptyState.tsx
      ReportLoadingState.tsx
      ReportErrorState.tsx
  hooks/
    useGenerateReport.ts
    useLocale.ts
  i18n/
    zh.ts / en.ts / index.ts
  utils/
    providers.ts
    pdf.ts
    ThemeContext.tsx
  types/
    report.ts
api/
  deepseek.ts
  gemini.ts
worker/
  worker.js
  wrangler.toml
```

## Privacy

- PDF files are parsed locally in the browser.
- No backend database is required.
- No analytics or user tracking is included.

## License

MIT
