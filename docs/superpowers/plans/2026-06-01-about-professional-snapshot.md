# About Professional Snapshot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static `/about` professional snapshot page that explains Maksym's current role, focus areas, and strongest proof links without implying active job hunting.

**Architecture:** Add page-specific profile copy to `src/lib/constants.ts`, then create a server-rendered App Router page at `src/app/about/page.tsx` that reuses `SITE`, `ABOUT`, `PROJECTS`, `JOURNEY`, `NOW`, and existing JSON-LD helpers. Wire `/about` into header, sticky nav, footer, and sitemap using the same patterns as `/now`, `/resume`, and `/uses`.

**Tech Stack:** Next.js 16 App Router, React 19 Server Components, TypeScript strict, Tailwind CSS v4, Schema.org Person JSON-LD.

---

## File Structure

- Create: `src/app/about/page.tsx`
  - Owns the `/about` route, metadata, JSON-LD script, and page layout.
  - Uses only local constants and server-rendered JSX.
- Modify: `src/lib/constants.ts`
  - Add an `ABOUT` constant for page-specific positioning copy and focus areas.
  - Keep identity/contact/project/timeline data in the existing constants.
- Modify: `src/components/SiteHeader.tsx`
  - Add `/about` to non-homepage navigation.
- Modify: `src/components/StickyNav.tsx`
  - Change the homepage-only `About` anchor label to `Intro` and add a separate `/about` link.
- Modify: `src/components/SiteFooter.tsx`
  - Add `/about` as a footer link without removing existing RSS/social links.
- Modify: `src/app/sitemap.ts`
  - Add `/about` as a static sitemap entry.
- Modify: `.agent/STATE.md`
  - Record that the about-page spec and plan are ready for implementation.

---

### Task 0: Create Tracking Issue and Implementation Worktree

**Files:**
- No source file changes.

- [ ] **Step 1: Confirm `main` is clean and current**

Run:

```bash
git switch main
git pull --ff-only origin main
git status --short
```

Expected: `git status --short` prints no output.

- [ ] **Step 2: Create the tracking issue and isolated worktree branch**

Run:

```bash
ISSUE_URL=$(gh issue create \
  --title "Add professional snapshot about page" \
  --body "Build a static /about page that presents Maksym's professional snapshot without job-seeking language. It should reuse portfolio constants, link to the strongest proof surfaces, and be wired into navigation, footer, and sitemap.")
ISSUE_NUMBER="${ISSUE_URL##*/}"
git worktree add .worktrees/about-professional-snapshot -b "issue-${ISSUE_NUMBER}/about-professional-snapshot" main
cd .worktrees/about-professional-snapshot
git branch --show-current
```

Expected: the command prints a branch name like `issue-12/about-professional-snapshot`.

---

### Task 1: Add About Page Content Model

**Files:**
- Modify: `src/lib/constants.ts`

- [ ] **Step 1: Verify the new constant does not exist**

Run:

```bash
rg "export const ABOUT" src/lib/constants.ts
```

Expected: no matches and exit code `1`.

- [ ] **Step 2: Add the `ABOUT` constant**

Append this block after the `NOW` export in `src/lib/constants.ts`:

```ts
export const ABOUT = {
  eyebrow: "Professional snapshot",
  headline: "I build security-minded systems, developer tooling, and AI-agent automation.",
  summary:
    "Software Engineer II at Microsoft Security working on Identity & Application Governance. I focus on backend systems, security controls, automation, and practical AI-agent workflows that make engineering teams safer and faster.",
  focusAreas: [
    {
      title: "Identity & security systems",
      description:
        "Current work in Microsoft Security, with a focus on governance, trust boundaries, and secure enterprise workflows.",
      proof: "See the mcpgate case study for policy enforcement, audit trails, and prompt-injection defenses.",
    },
    {
      title: "Developer tooling",
      description:
        "Experience building CI/CD, package management, licensing, and workflow automation across enterprise environments.",
      proof: "See the resume for Microsoft Security, EPAM, and Stora Enso experience.",
    },
    {
      title: "Agentic AI & automation",
      description:
        "Hands-on work with MCP, AI-agent governance, personal automation, and human-in-the-loop workflows.",
      proof: "See OpenClaw and mcpgate-related portfolio work.",
    },
  ],
  proofLinks: [
    {
      label: "Read the mcpgate case study",
      href: "/case-studies/mcpgate-v1-1",
      description: "Deep technical write-up on MCP gateway security controls.",
    },
    {
      label: "Open the share-ready summary",
      href: "/case-studies/mcpgate-v1-1/share",
      description: "Copy-ready recruiter and referral summary.",
    },
    {
      label: "View resume",
      href: "/resume",
      description: "Print-optimized professional experience and project summary.",
    },
  ],
} as const;
```

- [ ] **Step 3: Run the TypeScript compiler**

Run:

```bash
npx tsc --noEmit
```

Expected: exit code `0`.

- [ ] **Step 4: Commit**

Run:

```bash
git add src/lib/constants.ts
git commit -m "feat(about): add professional snapshot content" \
  -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 2: Create the Static `/about` Page

**Files:**
- Create: `src/app/about/page.tsx`

- [ ] **Step 1: Verify the route file does not exist**

Run:

```bash
test -f src/app/about/page.tsx
```

Expected: exit code `1`.

- [ ] **Step 2: Create `src/app/about/page.tsx`**

Create the file with this content:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ABOUT, JOURNEY, NOW, PROJECTS, SITE, TECH_STACK } from "@/lib/constants";
import { personSchema, safeJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "About — Maksym Mishchenko",
  description:
    "Professional snapshot for Maksym Mishchenko, Software Engineer II at Microsoft Security working on identity, security, developer tooling, and AI-agent automation.",
};

const professionalJourney = JOURNEY.filter((item) => !item.resumeHide);
const selectedProjects = PROJECTS.filter((project) => project.resume !== false);

export default function AboutPage() {
  return (
    <main id="main" className="min-h-screen px-6 py-24 sm:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(personSchema()) }}
      />

      <div className="mx-auto max-w-5xl space-y-14">
        <section className="rounded-2xl border border-border bg-surface/40 p-6 sm:p-8">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-accent">
            {ABOUT.eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {SITE.name}
          </h1>
          <p className="mt-3 text-lg font-medium text-accent">{SITE.status}</p>
          <p className="mt-6 max-w-3xl text-xl leading-relaxed text-foreground">
            {ABOUT.headline}
          </p>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted">{ABOUT.summary}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/resume"
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              View resume
            </Link>
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
            >
              LinkedIn
            </a>
            <a
              href={SITE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
            >
              GitHub
            </a>
            <a
              href={SITE.email}
              className="rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
            >
              Email
            </a>
          </div>
        </section>

        <section aria-labelledby="work-on">
          <h2 id="work-on" className="text-2xl font-semibold text-foreground">
            What I work on
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {ABOUT.focusAreas.map((area) => (
              <article key={area.title} className="rounded-xl border border-border bg-surface/40 p-5">
                <h3 className="text-lg font-semibold text-foreground">{area.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{area.description}</p>
                <p className="mt-4 text-sm leading-relaxed text-accent">{area.proof}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="proof-of-work">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="proof-of-work" className="text-2xl font-semibold text-foreground">
                Proof of work
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                A few direct links that show the type of systems, trade-offs, and delivery work I care about.
              </p>
            </div>
            <Link href="/case-studies" className="text-sm text-accent hover:underline">
              All case studies -&gt;
            </Link>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-xl border border-accent/40 bg-surface/50 p-5">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
                Flagship case study
              </p>
              <h3 className="mt-3 text-xl font-semibold text-foreground">mcpgate</h3>
              <p className="mt-3 leading-relaxed text-muted">
                Security gateway for MCP tool calls with policy enforcement, audit trails, and reverse-channel prompt-injection defenses.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {ABOUT.proofLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-full border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface/40 p-5">
              <h3 className="text-lg font-semibold text-foreground">Selected projects</h3>
              <div className="mt-4 space-y-4">
                {selectedProjects.map((project) => (
                  <article key={project.title}>
                    <h4 className="font-medium text-foreground">{project.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{project.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="timeline">
          <h2 id="timeline" className="text-2xl font-semibold text-foreground">
            Timeline at a glance
          </h2>
          <div className="mt-6 space-y-4">
            {professionalJourney.map((item) => (
              <article key={`${item.year}-${item.title}`} className="border-l-2 border-border pl-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <span className="font-mono text-xs text-accent">{item.year}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="current-focus" className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 id="current-focus" className="text-2xl font-semibold text-foreground">
              Current focus
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              What I am paying attention to right now, kept in sync with the rest of the site.
            </p>
          </div>
          <div className="space-y-3">
            {NOW.map((item) => (
              <p key={item.text} className="rounded-xl border border-border bg-surface/40 p-4 text-sm text-muted">
                <span className="mr-2" aria-hidden="true">
                  {item.emoji}
                </span>
                {item.text}
              </p>
            ))}
          </div>
        </section>

        <section aria-labelledby="tech-stack">
          <h2 id="tech-stack" className="text-2xl font-semibold text-foreground">
            Working stack
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TECH_STACK.map((category) => (
              <div key={category.name} className="rounded-xl border border-border bg-surface/40 p-5">
                <h3 className="font-semibold text-foreground">{category.name}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <span key={item} className="rounded-full bg-background px-2.5 py-1 text-xs text-muted">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Run targeted type validation**

Run:

```bash
npx tsc --noEmit
```

Expected: exit code `0`.

- [ ] **Step 4: Commit**

Run:

```bash
git add src/app/about/page.tsx
git commit -m "feat(about): add professional snapshot page" \
  -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 3: Wire `/about` Into Navigation and Sitemap

**Files:**
- Modify: `src/components/SiteHeader.tsx`
- Modify: `src/components/StickyNav.tsx`
- Modify: `src/components/SiteFooter.tsx`
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Add `/about` to `SiteHeader`**

Change the `LINKS` array in `src/components/SiteHeader.tsx` to:

```ts
const LINKS = [
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Now", href: "/now" },
  { label: "Resume", href: "/resume" },
  { label: "Uses", href: "/uses" },
];
```

- [ ] **Step 2: Add `/about` to `StickyNav` without losing the homepage anchor**

Change the `NAV_LINKS` array in `src/components/StickyNav.tsx` to:

```ts
const NAV_LINKS = [
  { label: "Projects", href: "#projects" },
  { label: "Journey", href: "#journey" },
  { label: "Stack", href: "#stack" },
  { label: "Intro", href: "#about" },
  { label: "Contact", href: "#contact" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Now", href: "/now" },
  { label: "Resume", href: "/resume" },
  { label: "Uses", href: "/uses" },
];
```

- [ ] **Step 3: Add `/about` to `SiteFooter`**

Add this link inside the footer link group before the RSS link in `src/components/SiteFooter.tsx`:

```tsx
<a
  href="/about"
  className="text-sm text-muted hover:text-foreground transition-colors"
>
  About
</a>
```

- [ ] **Step 4: Add `/about` to sitemap**

Add this entry in `src/app/sitemap.ts` after the homepage entry:

```ts
{ url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
```

The static section should now start like this:

```ts
return [
  { url: siteUrl, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 1 },
  { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
  { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
  { url: `${siteUrl}/case-studies`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
  { url: `${siteUrl}/now`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
  { url: `${siteUrl}/resume`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
  { url: `${siteUrl}/uses`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  ...blogEntries,
  ...caseStudyEntries,
  ...shareKitEntries,
];
```

- [ ] **Step 5: Run validation**

Run:

```bash
npm run lint
npx tsc --noEmit
```

Expected: both commands exit `0`. Existing non-failing lint warnings may remain unchanged.

If `npm run lint` scans local `.worktrees/**` build artifacts, add `.worktrees/**` and `worktrees/**` to `globalIgnores` in `eslint.config.mjs`, then rerun lint and type-check.

- [ ] **Step 6: Commit**

Run:

```bash
git add src/components/SiteHeader.tsx src/components/StickyNav.tsx src/components/SiteFooter.tsx src/app/sitemap.ts
git commit -m "feat(about): add profile page navigation" \
  -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 4: Final Build and Agent State

**Files:**
- Modify: `.agent/STATE.md`

- [ ] **Step 1: Run full build**

Run:

```bash
npm run build
```

Expected:

- Exit code `0`.
- Build output includes `/about` as a static route.

- [ ] **Step 2: Update `.agent/STATE.md`**

Set the file to reflect:

```md
# State — portfolio
Last updated: 2026-06-01 by maksym

## Done
- Phase 1 complete: /resume print-to-PDF, per-post OG images, JSON-LD Person/BlogPosting,
  RSS footer link, /now page, neutral status badge (SITE.status in Hero.tsx). [PR #6 merged]
- Phase 2 — richer project cards: `Project.thumbnail` now rendered as a 16:9 banner at the
  top of each card in `Projects.tsx` (next/image, unoptimized for SVG). On-brand terminal
  SVG thumbnails added for both projects in `public/images/portfolio/`. `learned` line
  already shipped. [feat/project-thumbnails]
- Flagship mcpgate case study shipped at `/case-studies/mcpgate-v1-1`. [PR #8 merged]
- Case-study distribution kit shipped at `/case-studies/mcpgate-v1-1/share`. [PR #9 merged]

## In progress
- About professional snapshot implemented on `issue-10/about-professional-snapshot`; PR pending/open for `/about`.

## Known issues
- 6 non-failing lint warnings remain in `mdx/interactive/InteractiveFlow.tsx`
  (unused props/setters/import).

## Next steps
- Review and merge the `/about` professional snapshot PR.
- Phase 3 backlog: client-side blog search over title/description/tags. (/now already exists.)
- Future: swap generated SVG thumbnails for real screenshots if desired.
```

- [ ] **Step 3: Commit state update**

Run:

```bash
git add .agent/STATE.md
git commit -m "docs(about): update professional snapshot state" \
  -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

- [ ] **Step 4: Confirm branch status**

Run:

```bash
git status --short
```

Expected: no output.

---

### Task 5: Open Pull Request

**Files:**
- No file changes.

- [ ] **Step 1: Push the branch**

Run:

```bash
git push -u origin HEAD
```

Expected: branch pushes successfully.

- [ ] **Step 2: Create PR**

Run:

```bash
ISSUE_NUMBER=$(git branch --show-current | sed -n 's/^issue-\([0-9][0-9]*\)\/about-professional-snapshot$/\1/p')
if [ -z "$ISSUE_NUMBER" ]; then
  echo "Could not derive issue number from branch name."
  exit 1
fi
BODY=$(cat <<'PR_BODY'
## Summary
- Add `/about` as a professional snapshot page for currently-employed positioning.
- Reuse portfolio constants for identity, proof links, projects, journey, current focus, and tech stack.
- Wire `/about` into navigation, footer, sitemap, and metadata.

## Test Plan
- [ ] npm run lint
- [ ] npx tsc --noEmit
- [ ] npm run build

Closes #ISSUE_NUMBER
PR_BODY
)
BODY=${BODY//#ISSUE_NUMBER/#${ISSUE_NUMBER}}
gh pr create \
  --title "feat(about): add professional snapshot page" \
  --body "$BODY"
```

Expected: GitHub returns a PR URL.

- [ ] **Step 3: Request final review**

Run:

```bash
gh pr checks --watch
```

Expected: all required checks pass before merge.
