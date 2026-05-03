# 🌐 mmishchenko.dev

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?logo=vercel)](https://mmishchenko.dev)

My personal portfolio and blog — built with Next.js 16 (App Router), MDX, and interactive animated components.

**Live → [mmishchenko.dev](https://mmishchenko.dev)**

## ✨ Features

- **Interactive MDX blog** with custom animated React components (Tokenizer, FlowDiagram, EmbeddingSpace, Aside)
- **Automated devlog pipeline** — LinkedIn posts auto-expand into long-form blog articles via GPT-4o
- **Dark theme** with spotlight hover effects and smooth Framer Motion animations
- **RSS feed** at `/blog/feed.xml`
- **SEO optimized** — dynamic sitemap, OpenGraph images, canonical URLs, security headers
- **Contact form** powered by Resend API
- **Responsive** — mobile-first design

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Blog | MDX via next-mdx-remote/rsc |
| Syntax Highlighting | sugar-high |
| Email | Resend API |
| Deployment | Vercel |
| Domain | Cloudflare DNS |

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Lint
npm run lint
```

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
│   └── mdx/
│       └── interactive/  # Animated blog components
├── lib/              # Constants, utilities
content/
└── blog/             # MDX blog posts
```

## 📝 Blog Components

The blog supports interactive MDX components:

- **`<Tokenizer>`** — Animated text → subword → token ID visualization with play/pause controls
- **`<FlowDiagram>`** — Step-by-step animated flow diagrams
- **`<EmbeddingSpace>`** — SVG-based word vector visualization
- **`<Aside>`** — Collapsible supplementary info panels

## 📄 License

[MIT](LICENSE)
