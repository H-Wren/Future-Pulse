# Future Pulse Design System — 轻科技学术

## Visual Theme & Atmosphere

Clean, scholarly minimalism with warmth. A well-lit reading room meets modern tech.
Not cold-industrial (like most SaaS), not heavy-traditional (like academic journals).
Balances authority with approachability — intelligent but not intimidating.

- **Density:** Generous whitespace, airy layouts, plenty of breathing room
- **Texture:** Subtle paper-like warmth on surfaces, not pure digital white
- **Mood:** Calm focus, like a sunlit library with modern furnishings
- **Typography-forward:** Content is king, UI recedes

## Color Palette

### Core Tokens

| Token | Hex | Dark Mode | Role |
|-------|-----|-----------|------|
| Canvas | `#f5f4f0` | `#141312` | Page background — warm parchment |
| Surface | `#ffffff` | `#1e1d1b` | Cards, elevated panels |
| Surface-Subtle | `#eeede8` | `#2a2826` | Secondary surfaces, header bg |
| Primary | `#2c6e7a` | `#5ba3b0` | Deep teal — buttons, links, active states |
| Primary-Glow | `#e4edef` | `#1c3a40` | Primary background tint |
| Accent-Gold | `#c4953a` | `#d4a84e` | Gold — badges, highlights, special states |
| Accent-Light | `#faf3e2` | `#2e2618` | Accent background tint |
| Danger | `#b94a4a` | `#d46a6a` | Errors, destructive actions |
| Success | `#4a8c6c` | `#6aaa84` | Status indicators |
| Text-Primary | `#2a2724` | `#e8e4df` | Body text — warm black |
| Text-Secondary | `#6b6560` | `#a39d98` | Secondary text, labels |
| Text-Muted | `#9c9590` | `#6b6560` | Placeholders, captions |
| Border | `#e5e0d9` | `#3a3734` | Card borders, dividers |
| Border-Light | `#efebe5` | `#2e2b28` | Subtle borders |

### Semantic Mappings

- **Primary Button:** Surface `#ffffff` on Primary `#2c6e7a`, hover darken to `#235a64`
- **Secondary Button:** Text Primary on transparent, hover Surface-Subtle
- **Link:** Primary, underline on hover
- **Status Online:** Success `#4a8c6c` with glow
- **Selection:** Primary-Glow bg, Primary text

## Typography

- **Chinese Body:** Noto Sans SC (400/500/600/700)
- **English/Body:** Inter (400/500/600/700)
- **Monospace:** JetBrains Mono or SF Mono

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Display (h1) | 1.75rem (28px) | 700 | 1.3 |
| Title (h2) | 1.25rem (20px) | 600 | 1.4 |
| Section (h3) | 1.1rem (18px) | 600 | 1.5 |
| Body | 0.875rem (14px) | 400 | 1.6 |
| Small | 0.75rem (12px) | 500 | 1.5 |
| Tiny | 0.688rem (11px) | 600 | 1.4 |
| Mono | 0.8125rem (13px) | 400 | 1.5 |

## Component Stylings

### Buttons
- **Primary:** bg Primary, text white, rounded-xl (12px), py-3.5 px-4
  - Hover: darken 5%, shadow-lg
  - Active: scale-98
  - Disabled: opacity-45, no shadow
- **Ghost/Icon:** transparent, p-2, rounded-lg (8px), hover bg Surface-Subtle

### Inputs & Textareas
- bg Surface-Subtle (or white with subtle border), border Border, rounded-xl
- Focus: ring-2 ring Primary / 20% opacity, border Primary
- Placeholder: Text-Muted
- Shadow-inner for depth on textareas

### Cards
- bg Surface, border Border, rounded-2xl (16px)
- Shadow: subtle elevation (shadow-sm)
- Dark: border 0.5 opacity, no shadow (depth via bg contrast)

### Status Badge
- rounded-full, font-mono, font-medium
- Online: bg Success/15%, text Success, border Success/30%, pulse dot
- Complete: bg Primary-Glow, text Primary

### Modals / Drawers
- Overlay: black at 30%, backdrop-blur-sm
- Panel: bg Surface, rounded-2xl, shadow-xl
- Drawer: slides from right, max-w-md, full height

## Layout Principles

- **Max width:** 1280px (max-w-7xl)
- **Grid:** 12 columns on lg, collapses to single column on mobile
- **Sidebar:** 4 columns (lg:col-span-4), Content: 8 columns (lg:col-span-8)
- **Whitespace:** p-4 (16px) as base unit, scales to p-6/p-8/p-10 on larger screens
- **Stack spacing:** space-y-5/6 between major sections, space-y-2.5 within sections

## Depth & Elevation

- **Flat (surface):** no shadow, just border separation
- **Raised (card):** shadow-sm `0 1px 3px rgba(0,0,0,0.06)`
- **Elevated (modal):** shadow-xl `0 20px 60px rgba(0,0,0,0.15)`
- **Dark mode:** no shadows, use bg contrast only (border +1 step lighter than surface)

## Do's and Don'ts

- ✅ DO use generous whitespace — don't crowd elements
- ✅ DO use warm grays over cool grays — feels more natural
- ✅ DO use teal as primary — conveys intelligence without being cold
- ❌ DON'T use pure black (#000) for text — use warm dark instead
- ❌ DON'T overuse gold accent — sparingly for special states only
- ✅ DO keep gradients subtle and rare (header icon only)
- ✅ DO use semantic color names consistently

## Responsive Behavior

- **Mobile (< 768px):** single column, sidebar above content, reduced padding (p-4)
- **Tablet (768-1024px):** 5-column grid (sidebar 2, content 3)
- **Desktop (> 1024px):** 12-column grid (sidebar 4, content 8)
- Touch targets min 44px on mobile
- Textareas remain full height on all screens

## Agent Prompt Guide

Reference this DESIGN.md for all UI styling decisions.
- Use `bg-[#f5f4f0]` for page background, `bg-white` for cards
- Primary color is teal `#2c6e7a` — not indigo, not blue
- All borders use warm gray `#e5e0d9` not cool gray
- Keep the feel "calm, scholarly, warm tech"
- Gold accent `#c4953a` only for "complete" badges and special highlights
- Typography: Noto Sans SC for Chinese, Inter for English
