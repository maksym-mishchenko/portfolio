# Portfolio — Agent Instructions

> Personal developer portfolio and blog at mmishchenko.dev — Next.js 16, MDX blog, Framer Motion animations.

## Project Summary

| Field           | Value                                                      |
| --------------- | ---------------------------------------------------------- |
| Stack           | Next.js 16, React 19, TypeScript (strict), Tailwind CSS v4 |
| Blog            | MDX files in `content/blog/` via `next-mdx-remote`         |
| Email           | Resend (contact form)                                      |
| Analytics       | Vercel Analytics + Speed Insights                          |
| Deploy          | Vercel                                                     |
| Node            | ≥ 22 (CI uses Node 22)                                     |
| Package manager | npm                                                        |

## Repository Structure

```
content/
└── blog/                    # MDX blog posts (source of truth)
src/
├── app/
│   ├── api/
│   │   ├── contact/route.ts         # Contact form (Zod validation → Resend)
│   │   └── blog/publish/route.ts    # Authenticated MDX publisher via GitHub API
│   ├── blog/
│   │   ├── page.tsx                 # Blog index
│   │   ├── [slug]/page.tsx          # Dynamic blog post (SSG)
│   │   └── feed.xml/route.ts        # RSS feed
│   ├── uses/page.tsx                # Uses page
│   ├── layout.tsx                   # Root layout (fonts, metadata, analytics)
│   ├── page.tsx                     # Homepage
│   ├── sitemap.ts                   # Dynamic sitemap generation
│   ├── robots.ts                    # Robots.txt generation
│   ├── opengraph-image.tsx          # OG image generation (satori)
│   └── icon.tsx                     # Favicon generation
├── components/
│   ├── mdx/index.tsx                # MDX component map (custom renderers)
│   ├── Hero.tsx                     # Terminal-style hero (client, animated)
│   ├── Projects.tsx                 # Project cards
│   ├── Journey.tsx                  # Career timeline
│   ├── TechStack.tsx                # Tech stack display
│   ├── About.tsx                    # Bio section
│   └── Contact.tsx                  # Contact form (client, Zod)
├── lib/
│   ├── blog.ts                      # MDX parsing, frontmatter (gray-matter), reading time
│   ├── constants.ts                 # Site metadata, projects, journey, tech stack
│   └── rate-limit.ts                # In-memory IP rate limiter (resets on cold start)
scripts/
└── blog-images/                     # Blog image utilities
.github/
├── workflows/ci.yml                 # PR CI: lint → typecheck → build (Node 22)
├── workflows/blog-autopublish.yml   # Auto-publishes MDX to devlog-publisher on main push
└── skills/humanizer/SKILL.md        # Content humanizing agent skill
```

## Commands

| Action           | Command            | Notes                        |
| ---------------- | ------------------ | ---------------------------- |
| Dev server       | `npm run dev`      | Hot reload on localhost:3000 |
| Production build | `npm run build`    | Must pass before any merge   |
| Start production | `npm run start`    | Requires prior build         |
| Lint             | `npm run lint`     | ESLint (eslint-config-next)  |
| Type check       | `npx tsc --noEmit` | Must pass before any merge   |
| Install deps     | `npm install`      | Or `npm ci` in CI            |

## Architecture

- **Static-first**: Blog posts are MDX files read at build/request time from `content/blog/`
- **No database**: All content is file-based (MDX) or defined in `lib/constants.ts`
- **Contact form**: Client `<Contact>` → Zod validation → `/api/contact` → Resend API
- **Blog publishing**: Authenticated `/api/blog/publish` route creates/updates MDX files via GitHub API
- **Blog autopublish**: Push to `main` with changed `content/blog/*.mdx` → GitHub Action → devlog-publisher API
- **SEO**: Sitemap, robots.txt, RSS feed, OG images (satori + sharp), favicons all generated programmatically
- **Animations**: Framer Motion on Hero, Projects, Journey, TechStack — all `"use client"` components
- **Security headers**: CSP + HSTS + X-Frame-Options in `next.config.ts`

## Coding Conventions

### Required

- TypeScript strict mode — no `any`, no disabled checks
- Functional React components with hooks only — no class components
- `async/await` over `.then()` chains
- Path alias `@/*` → `./src/*`
- Server Components by default; `"use client"` only when needed (animations, forms, interactivity)
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`
- All blog posts in `content/blog/` as `.mdx` files with YAML frontmatter
- All site metadata (name, title, social links, projects, stack) lives in `src/lib/constants.ts`

### Forbidden

| Pattern                                     | Why                            | Use Instead                               |
| ------------------------------------------- | ------------------------------ | ----------------------------------------- |
| `any` type                                  | Loses type safety              | Proper typing or `unknown`                |
| `var` declarations                          | Function-scoped, error-prone   | `const` or `let`                          |
| `.then()` chains                            | Less readable, harder to debug | `async/await`                             |
| Hardcoding personal data                    | Maintenance nightmare          | `src/lib/constants.ts`                    |
| Heavy client deps without justification     | Bundle size regression         | Server Components or lighter alternatives |
| Disabling TypeScript strict checks          | Masks bugs                     | Fix the types                             |
| Committing secrets or API keys              | Security risk                  | `.env` (gitignored) + `.env.example`      |
| Additional font loading outside `next/font` | Layout shift, double-loading   | Edit existing font setup in `layout.tsx`  |

## Testing

No test framework configured. CI validates via lint + typecheck + build.

**If adding tests:**

- Use **Vitest** for unit tests
- Use **Playwright** for E2E tests

**Minimum validation before claiming a task done:**

1. `npm run lint` — zero warnings
2. `npx tsc --noEmit` — zero errors
3. `npm run build` — succeeds

## Environment Variables

| Variable                | Purpose                                                | Required                                       |
| ----------------------- | ------------------------------------------------------ | ---------------------------------------------- |
| `RESEND_API_KEY`        | Email sending via Resend API                           | No (contact form silently skips if missing)    |
| `GITHUB_TOKEN`          | Blog publish API authentication                        | No (blog publish endpoint requires it in prod) |
| `BLOG_PUBLISH_SECRET`   | Secret token for `/api/blog/publish` auth              | No (local dev only)                            |
| `CONTACT_EMAIL`         | Recipient address for contact form                     | No                                             |
| `STAGING_SECRET`        | Staging environment access secret                      | No                                             |
| `DEVLOG_AGENT_PASSWORD` | Auth for devlog-publisher in blog-autopublish workflow | CI secret only                                 |
| `NODE_ENV`              | Runtime environment                                    | Auto-set by Next.js                            |

## Known Pitfalls

| Issue                                          | Workaround                                                                                               |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Blog images not rendering                      | Images must be in `public/images/` and referenced with absolute paths from root (e.g. `/images/foo.png`) |
| Rate limiting resets on cold start             | In-memory `rate-limit.ts` — expected behavior on Vercel serverless; not a bug                            |
| MDX component mismatch                         | Custom components in `src/components/mdx/index.tsx` must be registered before use in MDX files           |
| Font layout shift                              | Only Inter + JetBrains Mono via `next/font` — adding more causes CLS                                     |
| Blog autopublish skips deletions               | `blog-autopublish.yml` only publishes new/modified files, not deleted ones                               |
| `next.config.ts` vs `.js` vs `.mjs`            | This repo uses `next.config.ts` — don't create alternative config files                                  |
| Missing `"use client"` causes hydration errors | All hooks (`useState`, `useEffect`, etc.) require client boundary                                        |
| Server Components can't use hooks              | Move hook logic to a child client component                                                              |

## Git Workflow

### Branch Naming

```
<type>/<short-description>
```

| Type        | Use For                   | Example                       |
| ----------- | ------------------------- | ----------------------------- |
| `feat/`     | New features              | `feat/add-dark-mode`          |
| `fix/`      | Bug fixes                 | `fix/contact-form-validation` |
| `chore/`    | Maintenance, deps, config | `chore/update-next`           |
| `refactor/` | Code restructuring        | `refactor/extract-blog-utils` |
| `docs/`     | Documentation only        | `docs/update-readme`          |
| `test/`     | Test additions/fixes      | `test/add-blog-utils-tests`   |

### Commit Messages

Format: `<type>(<scope>): <description>`

```
feat(blog): add reading time display
fix(contact): handle missing RESEND_API_KEY gracefully
chore(deps): update next to 16.3.0
```

Always include trailer:

```
Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

### Pull Requests

- **Title format:** Same as commit: `<type>(<scope>): <description>`
- **CI required:** Lint → typecheck → build must all pass
- **Merge strategy:** Squash and merge to `main`
- Push to `main` triggers blog autopublish for any changed MDX files

## Deployment

- **Platform**: Vercel — auto-deploys on push to `main` via Git integration
- **Build command**: `npm run build`
- **Domain**: mmishchenko.dev
- **CI gate**: GitHub Actions on PR (`ci.yml`): lint → typecheck → build (Node 22)
- **Blog publish pipeline**: `blog-autopublish.yml` detects changed MDX on `main` push and POSTs to devlog-publisher API

## Security

### MUST

- Never commit secrets, API keys, or tokens — use `.env` (gitignored) + `.env.example`
- Never log PII (emails, passwords, tokens) even at debug level
- Validate all external input (API params, form data, URL params) — see Zod usage in contact route
- Security headers configured globally in `next.config.ts` — do not weaken them

### MUST NOT

- Never disable SSL/TLS verification
- Never use `eval()` or dynamic code execution with user input
- Never expose stack traces to end users in production

### Generated / Do-Not-Edit Files

| File                | Generated By    | Edit Instead   |
| ------------------- | --------------- | -------------- |
| `package-lock.json` | `npm install`   | `package.json` |
| `.next/`            | `npm run build` | Source files   |
| `node_modules/`     | `npm install`   | `package.json` |

## Module Boundaries

- `src/lib/` — pure utility modules, no React imports allowed
- `src/components/` — React components only; no direct file I/O
- `src/app/` — Next.js routing layer; imports from `lib/` and `components/`
- `content/blog/` — MDX content only; no code imports
- `src/lib/constants.ts` — single source of truth for all site data; imported by both components and API routes
- API routes (`src/app/api/`) — server-only; never import client-side code

## Error Handling

API routes follow this pattern — parse input with Zod, return structured JSON errors:

```typescript
// src/app/api/contact/route.ts
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  // ... handle success
}
```

Client components use `try/catch` with user-visible error state (no raw error messages exposed).

## Agent Output Contract

When completing a task, agents MUST report:

1. **Files changed** — list all modified/created/deleted files
2. **Commands run** — exact validation commands executed (`npm run lint`, `npx tsc --noEmit`, `npm run build`)
3. **Test results** — CI equivalent: lint + typecheck + build pass/fail
4. **What was NOT verified** — be honest about gaps (e.g., "did not test email sending locally")
5. **Risks** — any correctness, compatibility, or performance concerns

Additionally:

- Blog content changes go in `content/blog/` as `.mdx` with valid frontmatter
- Site metadata changes go in `src/lib/constants.ts` — never hardcode elsewhere
- Do not modify security headers in `next.config.ts` without explicit request

## Pre-Commit Checklist

**MUST (required for merge):**

- [ ] `npm run lint` passes with zero warnings
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] `npm run build` succeeds
- [ ] No secrets or hardcoded credentials in committed code
- [ ] Conventional commit message with Co-authored-by trailer
- [ ] MDX frontmatter is valid if blog posts were changed
- [ ] New env vars documented in `.env.example`

**SHOULD (expected unless justified):**

- [ ] New/changed code has test coverage (if test framework added)
- [ ] Functions under 50 lines
- [ ] Files under 300 lines
- [ ] No `TODO`/`FIXME` without a linked issue

<!-- agent-readiness:managed — Do not remove this line. Sections above
     are auto-generated by the agent-readiness skill. Add custom
     project-specific sections BELOW this marker. They will be
     preserved when running agent-readiness update. -->
