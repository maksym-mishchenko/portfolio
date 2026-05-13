# Portfolio — Copilot Instructions

Next.js 16 + React 19 + TypeScript (strict) + Tailwind v4 + MDX blog + Framer Motion.
Personal portfolio/blog at mmishchenko.dev.

## Key Rules
- TypeScript strict, no `any`. Path alias: `@/*` → `./src/*`
- Server Components by default; `"use client"` only for interactivity/animations
- `async/await` only, no `.then()` chains
- Conventional commits: `feat:`, `fix:`, `chore:`
- Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>

## Architecture
- Blog: MDX files in `content/blog/`, parsed by `src/lib/blog.ts`
- No database — content is file-based or in `src/lib/constants.ts`
- Contact form: Zod validation → API route → Resend email
- SEO: Sitemap, robots.txt, RSS feed, OG images all generated programmatically
- Security headers in `next.config.ts` (CSP, HSTS, X-Frame-Options)

## Commands
- `npm run dev` / `npm run build` / `npm run lint` / `npx tsc --noEmit`

## CI
- GitHub Actions on PR: lint → typecheck → build (Node 22)

## Validation
- `npm run lint` + `npx tsc --noEmit` + `npm run build` must pass
- Site metadata in `src/lib/constants.ts` — don't hardcode elsewhere

<!-- agent-readiness:managed -->
