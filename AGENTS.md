# Portfolio — Agent Instructions

> Personal developer portfolio and blog at mmishchenko.dev — Next.js 16, MDX blog, Framer Motion animations.

## Project Summary

| Field | Value |
|-------|-------|
| Stack | Next.js 16, React 19, TypeScript (strict), Tailwind CSS v4 |
| Blog | MDX files in `content/blog/` via `next-mdx-remote` |
| Email | Resend (contact form) |
| Analytics | Vercel Analytics + Speed Insights |
| Deploy | Vercel |
| Node | ≥ 22 (CI uses Node 22) |
| Package manager | npm |

## Repository Structure

```
content/
└── blog/                    # MDX blog posts
src/
├── app/
│   ├── api/
│   │   ├── contact/route.ts     # Contact form (Resend email)
│   │   └── blog/publish/route.ts # Authenticated MDX publisher
│   ├── blog/
│   │   ├── page.tsx             # Blog index
│   │   ├── [slug]/page.tsx      # Dynamic blog post
│   │   └── feed.xml/route.ts   # RSS feed
│   ├── uses/page.tsx            # Uses page
│   ├── layout.tsx               # Root layout (fonts, metadata, analytics)
│   ├── page.tsx                 # Homepage
│   ├── sitemap.ts               # Dynamic sitemap
│   ├── robots.ts                # Robots.txt
│   ├── opengraph-image.tsx      # OG image generation
│   └── icon.tsx                 # Favicon generation
├── components/
│   ├── mdx/index.tsx            # MDX component map
│   ├── Hero.tsx                 # Terminal-style hero
│   ├── Projects.tsx             # Project cards
│   ├── Journey.tsx              # Career timeline
│   ├── TechStack.tsx            # Tech stack display
│   ├── About.tsx                # Bio section
│   └── Contact.tsx              # Contact form (client)
├── lib/
│   ├── blog.ts                  # MDX parsing, frontmatter, reading time
│   ├── constants.ts             # Site metadata, projects, journey, tech stack
│   └── rate-limit.ts            # In-memory IP rate limiter
scripts/
└── blog-images/                 # Blog image utilities
.github/
├── workflows/ci.yml             # PR CI: lint + typecheck + build
└── skills/humanizer/SKILL.md    # Content humanizing skill
```

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint check |
| `npx tsc --noEmit` | TypeScript type check |

## Architecture

- **Static-first**: Blog posts are MDX files read at build/request time from `content/blog/`
- **No database**: All content is file-based (MDX) or defined in `lib/constants.ts`
- **Contact form**: Client form → API route → Resend email
- **Blog publishing**: Authenticated API route that creates/updates MDX files via GitHub API
- **SEO**: Sitemap, robots.txt, RSS feed, OG images all generated programmatically
- **Animations**: Framer Motion throughout UI components
- **Security headers**: CSP + HSTS + X-Frame-Options in `next.config.ts`

## Coding Conventions

### Required

- TypeScript strict mode
- Functional React components with hooks
- `async/await` over `.then()` chains
- Path alias `@/*` → `./src/*`
- Server Components by default; `"use client"` only when needed (animations, forms, interactivity)
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`
- All blog posts in `content/blog/` as `.mdx` files with frontmatter

### Forbidden

- Do NOT use `var`
- Do NOT disable TypeScript strict checks
- Do NOT hardcode personal data outside `lib/constants.ts`
- Do NOT add heavy client-side dependencies without justification
- Do NOT import from `node_modules` internals

## Testing

No test framework configured. CI runs lint + typecheck + build.

If adding tests:
- Use Vitest for unit tests
- Use Playwright for E2E tests

## Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `RESEND_API_KEY` | Email sending via Resend | Optional (contact form) |
| `GITHUB_TOKEN` | Blog publish API authentication | Optional |

No `.env.example` file exists — env vars are optional for local dev.

## Known Pitfalls

1. **Blog images**: MDX images must be in `public/images/` and referenced with relative paths
2. **Rate limiting**: In-memory only — resets on cold start (Vercel serverless)
3. **Blog publish auth**: Uses hardcoded token check — ensure `GITHUB_TOKEN` is set in production
4. **MDX components**: Custom components in `src/components/mdx/index.tsx` must match MDX content expectations
5. **Fonts**: Inter + JetBrains Mono loaded via `next/font` — don't add additional font loading

## Git Workflow

- Branch from `main`
- PR triggers CI (`.github/workflows/ci.yml`): lint → typecheck → build
- Conventional commit messages
- Always include: `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`

## Deployment

- **Platform**: Vercel
- **Build**: `npm run build`
- **CI**: GitHub Actions on PR (lint + tsc + build)
- **Domain**: mmishchenko.dev
- Deploys on push to `main` via Vercel Git integration

## Security

- Security headers in `next.config.ts` (CSP, HSTS, X-Frame-Options)
- Contact form: honeypot field + rate limiting
- Blog publish: token-authenticated
- No user data stored

## Error Handling

- API routes: try/catch with proper HTTP status codes
- Contact form: client-side validation (Zod) + server validation
- Graceful fallbacks for missing blog content

## Agent Output Contract

- All changes must pass `npm run lint`, `npx tsc --noEmit`, and `npm run build`
- Blog content changes go in `content/blog/` as MDX
- Site metadata changes go in `src/lib/constants.ts`
- Do not modify security headers without explicit request

## Pre-Commit Checklist

- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` succeeds
- [ ] No secrets in committed code
- [ ] Conventional commit message with Co-authored-by trailer
- [ ] MDX frontmatter valid if blog posts changed

<!-- agent-readiness:managed -->
