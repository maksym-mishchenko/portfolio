# Portfolio — Copilot Instructions

Next.js 16 + React 19 + TypeScript (strict) + Tailwind v4 + MDX blog + Framer Motion.
Personal portfolio/blog at mmishchenko.dev.

## Commands

| Action | Command | Notes |
|--------|---------|-------|
| Dev server | `npm run dev` | localhost:3000 |
| Build | `npm run build` | Must pass before merge |
| Lint | `npm run lint` | ESLint (eslint-config-next) |
| Type check | `npx tsc --noEmit` | Must pass before merge |

## Coding Conventions

### Required

- TypeScript strict, no `any`. Path alias: `@/*` → `./src/*`
- Server Components by default; `"use client"` only for interactivity/animations
- `async/await` only, no `.then()` chains
- All site metadata in `src/lib/constants.ts` — never hardcode elsewhere
- All blog posts in `content/blog/` as `.mdx` files with YAML frontmatter
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`
- Always include: `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`

### Forbidden

| Pattern | Why | Use Instead |
|---------|-----|-------------|
| `any` type | Loses type safety | Proper typing or `unknown` |
| `var` declarations | Function-scoped, error-prone | `const` or `let` |
| `.then()` chains | Less readable | `async/await` |
| Hardcoding personal data | Use `lib/constants.ts` | `src/lib/constants.ts` |
| Disabling TypeScript strict checks | Masks bugs | Fix the types |
| Committing secrets | Security risk | `.env` + `.env.example` |
| Extra font loading | CLS regression | Edit existing `next/font` setup in `layout.tsx` |

## Known Pitfalls

| Issue | Workaround |
|-------|-----------|
| Blog images not rendering | Use `/images/foo.png` absolute paths pointing to `public/images/` |
| Rate limit resets on cold start | Expected — in-memory `rate-limit.ts` on Vercel serverless |
| MDX component not rendering | Register it in `src/components/mdx/index.tsx` first |
| Missing `"use client"` | All hooks require client boundary — add directive to component |
| `next.config.ts` vs `.js` | Repo uses `.ts` only — don't create alternate config files |
| Blog autopublish skips deletions | `blog-autopublish.yml` only handles new/modified MDX, not deleted |

## Git Workflow

- **Branch:** `<type>/<short-description>` (feat/, fix/, chore/, refactor/)
- **Commits:** `<type>(<scope>): <description>`
- **PRs:** Squash and merge. Title = commit message format.
- **CI:** lint → typecheck → build (Node 22) must pass on every PR
- **Trailer:** `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`

## Security

- Never commit secrets — use `.env` (gitignored) + `.env.example`
- Security headers in `next.config.ts` (CSP, HSTS, X-Frame-Options) — do not weaken
- Validate all external input with Zod (see contact route pattern)
- No `eval()` with user input

## Pre-Commit Checklist

- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` succeeds
- [ ] No secrets or hardcoded credentials
- [ ] Conventional commit message with Co-authored-by trailer
- [ ] MDX frontmatter valid if blog posts changed

<!-- agent-readiness:managed — Do not remove this line. -->
