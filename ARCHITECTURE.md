# Portfolio — Architecture

## System Overview

```
┌──────────────────────────────────────────┐
│              Vercel Edge                  │
├──────────────────────────────────────────┤
│  Next.js 16 App Router                   │
│  ┌──────────────┐  ┌─────────────────┐   │
│  │  Pages        │  │  API Routes     │   │
│  │  - Home       │  │  - /api/contact │   │
│  │  - Blog index │  │  - /api/blog/   │   │
│  │  - Blog [slug]│  │    publish      │   │
│  │  - Uses       │  └────────┬────────┘   │
│  └──────┬───────┘            │            │
│         │                    │            │
│  ┌──────▼───────┐   ┌───────▼────────┐   │
│  │ content/blog/ │   │  Resend API    │   │
│  │ (MDX files)   │   │  (email send)  │   │
│  └──────────────┘   └────────────────┘   │
│                                           │
│  SEO: sitemap.ts, robots.ts, RSS,         │
│       OG images, favicons                 │
└──────────────────────────────────────────┘
```

## Content Pipeline

1. Blog posts: MDX files in `content/blog/` with YAML frontmatter
2. `src/lib/blog.ts` reads, parses frontmatter (gray-matter), computes reading time
3. `next-mdx-remote` renders MDX with custom components from `src/components/mdx/`
4. Static params generated for all blog slugs

## Key Design Decisions

- File-based content (MDX) — no CMS or database
- Site metadata centralized in `src/lib/constants.ts`
- Framer Motion for UI animations
- Security headers applied globally via next.config.ts
- In-memory rate limiting on contact form (resets on cold start)
