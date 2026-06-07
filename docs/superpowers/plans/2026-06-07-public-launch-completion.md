# Public Launch Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the portfolio to a public-launch-complete standard: strong first impression, credible proof, cohesive discovery, verified metadata, and final release hygiene.

**Architecture:** Keep the existing Next.js App Router and file-based content architecture. Make surgical updates to shared constants, page components, metadata helpers, and one launch smoke script. Each task is independently shippable and should be committed before moving to the next task.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4 design tokens, MDX content, Vercel, Bash smoke checks.

---

## File Structure

- `src/lib/constants.ts`: source of truth for site identity, resume journey, projects, About proof, and Now page freshness.
- `src/app/resume/page.tsx`: renders resume data from `JOURNEY`; update to render optional achievement bullets.
- `src/app/case-studies/page.tsx`: reframe case-studies index around the current flagship case study.
- `src/app/blog/page.tsx`: add first-time-reader/featured path above search.
- `src/components/BlogSearch.tsx`: align search and empty states with site tokens.
- `src/app/now/page.tsx`: render static `NOW_LAST_UPDATED` instead of dynamic current date.
- `src/lib/jsonld.ts`: enrich Person, BlogPosting, and TechArticle structured data.
- `src/app/layout.tsx`: align root metadata with richer site identity and share image.
- `src/app/blog/[slug]/page.tsx`: add canonical URL and explicit OG URL for blog posts.
- `src/app/case-studies/[slug]/page.tsx`: add canonical URL and explicit OG URL for case studies.
- `scripts/launch-smoke.sh`: add repeatable local or live smoke checks for public launch.
- `CHANGELOG.md`: record the launch-hardening work.
- `.agent/STATE.md`: update durable project state after the sprint.
- `package.json` and `package-lock.json`: bump the package version to `0.2.0` as the public-launch-complete release.

## Task 1: Ship and verify current homepage credibility branch

**Files:**
- Inspect: `src/components/Hero.tsx`
- Inspect: `src/components/About.tsx`
- Inspect: `CHANGELOG.md`
- Inspect: `docs/superpowers/plans/2026-06-05-homepage-credibility-lift.md`

- [ ] **Step 1: Confirm current branch state**

Run:

```bash
git --no-pager status --short --branch
git --no-pager log --oneline -5
```

Expected:

- Branch is not `main`.
- Worktree is clean before starting implementation tasks.
- Recent history includes the homepage credibility lift commit.

- [ ] **Step 2: Run pre-merge verification**

Run:

```bash
npm run lint
npx tsc --noEmit
npm run build
npm audit --audit-level=moderate
```

Expected:

- All commands exit `0`.
- Build warning about Edge runtime is acceptable only if already present and unrelated.

- [ ] **Step 3: Push branch and prepare PR**

Run:

```bash
git push -u origin docs/personal-website-critique-spec
gh pr status
```

Expected:

- Branch is pushed.
- If a PR already exists for the branch, update it with the public-launch completion context.
- If no PR exists, create one before merge using a title like `feat: polish homepage credibility`.

- [ ] **Step 4: Merge and deploy**

Use the repository PR workflow. Do not push directly to `main`.

After merge, verify live homepage:

```bash
curl -fsSI https://mmishchenko.dev/ | head
curl -fsS https://mmishchenko.dev/ | grep -E "Maksym Mishchenko|Resume|Security-minded"
```

Expected:

- HTTP response succeeds.
- Live HTML includes visible homepage identity and Resume CTA text.

## Task 2: Add truthful resume achievement bullets

**Files:**
- Modify: `src/lib/constants.ts`
- Modify: `src/app/resume/page.tsx`

- [ ] **Step 1: Extend the journey type**

In `src/lib/constants.ts`, update `JourneyNode`:

```ts
export interface JourneyNode {
  year: string;
  icon: string;
  title: string;
  detail: string;
  achievements?: string[];
  link?: string;
  resumeHide?: boolean;
}
```

- [ ] **Step 2: Add factual bullets to professional entries**

In `src/lib/constants.ts`, add `achievements` only to the professional entries below:

```ts
{
  year: "2019",
  icon: "💼",
  title: "Stora Enso",
  detail: "Java Developer — invoice processing, land management systems",
  achievements: [
    "Built and maintained Java business-system features for invoice processing and land-management workflows.",
    "Worked on enterprise data flows where reliability, traceability, and business correctness mattered.",
  ],
},
{
  year: "2022",
  icon: "💼",
  title: "EPAM Systems",
  detail: "SW Engineer → Senior SE — DevEx, licensing & package management in CI/CD (financial services)",
  achievements: [
    "Delivered developer-experience work around CI/CD, licensing, and package-management workflows for financial-services environments.",
    "Progressed from Software Engineer to Senior Software Engineer while working across enterprise delivery constraints.",
  ],
},
{
  year: "2025",
  icon: "🚀",
  title: "Microsoft Security",
  detail: "Software Engineer II — Identity & Application Governance, Prague",
  achievements: [
    "Work on Identity & Application Governance systems in Microsoft Security.",
    "Focus on governance, trust boundaries, secure enterprise workflows, and practical security controls.",
  ],
},
```

Do not add metrics or scale claims unless the user supplies exact verified numbers.

- [ ] **Step 3: Render bullets on the resume**

In `src/app/resume/page.tsx`, after the existing role detail paragraph:

```tsx
<p className="text-sm text-muted mt-1 print:text-gray-600 print:text-xs">{node.detail}</p>
{node.achievements && (
  <ul className="mt-2 space-y-1.5 text-sm text-muted print:text-xs print:text-gray-700">
    {node.achievements.map((achievement) => (
      <li key={achievement} className="flex gap-2">
        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent print:bg-gray-500" aria-hidden="true" />
        <span>{achievement}</span>
      </li>
    ))}
  </ul>
)}
```

- [ ] **Step 4: Verify resume type safety and rendering**

Run:

```bash
npx tsc --noEmit
npm run build
```

Expected:

- Both commands exit `0`.
- `/resume` remains a static route in the build output.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/lib/constants.ts src/app/resume/page.tsx
git commit -m "feat(resume): add launch proof bullets" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

## Task 3: Reframe case-studies index around the flagship

**Files:**
- Modify: `src/app/case-studies/page.tsx`

- [ ] **Step 1: Update page metadata copy**

Change metadata to:

```ts
export const metadata: Metadata = {
  title: "Case Study - Maksym Mishchenko",
  description:
    "Flagship deep dive into shipped security engineering work, MCP gateway design, and AI-agent governance tradeoffs.",
};
```

- [ ] **Step 2: Reframe the page header**

Replace the top copy with:

```tsx
<main id="main" className="mx-auto max-w-4xl px-6 py-20">
  <p className="mb-3 font-mono text-sm text-accent">FLAGSHIP CASE STUDY</p>
  <h1 className="mb-4 font-heading text-4xl font-bold">Security engineering work, explained.</h1>
  <p className="mb-10 max-w-2xl text-muted">
    One current flagship deep dive into MCP tool-call security: the risk, the design constraints,
    what shipped, and how the outcome was verified.
  </p>
```

- [ ] **Step 3: Make the card feel intentional**

Keep the existing `caseStudies.map`, but update card classes and CTA text:

```tsx
className="group block rounded-2xl border border-accent/30 bg-surface p-6 transition-colors hover:border-accent/60"
```

Add a small label inside each card before the project/date row:

```tsx
<p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
  Current flagship
</p>
```

Change CTA text to:

```tsx
<p className="text-sm text-accent">Read the flagship case study -&gt;</p>
```

- [ ] **Step 4: Add future-case-study note**

Below the mapped cards, add:

```tsx
<div className="mt-8 rounded-xl border border-border bg-surface/40 p-5">
  <h2 className="text-lg font-semibold text-foreground">More deep dives will follow when they are worth reading.</h2>
  <p className="mt-2 text-sm leading-relaxed text-muted">
    I would rather keep this page focused than pad it with shallow write-ups. The current flagship is the best
    representative sample of my security, backend, and AI-agent governance work.
  </p>
</div>
```

- [ ] **Step 5: Verify and commit**

Run:

```bash
npx tsc --noEmit
npm run build
git add src/app/case-studies/page.tsx
git commit -m "feat(case-studies): frame mcpgate as flagship" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

Expected:

- Typecheck and build exit `0`.

## Task 4: Polish blog discovery and reader path

**Files:**
- Modify: `src/app/blog/page.tsx`
- Modify: `src/components/BlogSearch.tsx`
- Optional delete if still unused after confirmation: `src/components/BlogList.tsx`

- [ ] **Step 1: Add a featured post lookup**

In `src/app/blog/page.tsx`, after `const posts = getAllPosts();` add:

```ts
const featuredPost = posts.find((post) => post.slug === "mcp-servers-in-production") ?? posts[0];
```

- [ ] **Step 2: Add a Start Here card before search**

In `src/app/blog/page.tsx`, between the description paragraph and `<BlogSearch posts={posts} />`, add:

```tsx
{featuredPost && (
  <Link
    href={`/blog/${featuredPost.slug}`}
    className="mb-8 block rounded-2xl border border-accent/30 bg-surface p-5 transition-colors hover:border-accent/60"
  >
    <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">Start here</p>
    <h2 className="mt-3 text-xl font-semibold text-foreground">{featuredPost.title}</h2>
    <p className="mt-2 text-sm leading-relaxed text-muted">{featuredPost.description}</p>
    <p className="mt-4 text-sm text-accent">Read the recommended first post -&gt;</p>
  </Link>
)}
```

- [ ] **Step 3: Align `BlogSearch` search panel with tokens**

In `src/components/BlogSearch.tsx`, replace the search panel classes:

```tsx
<div className="rounded-2xl border border-border bg-surface/40 p-4">
```

Use this input class:

```tsx
className="min-h-11 flex-1 rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
```

Use this result label class:

```tsx
className="text-sm text-muted"
```

- [ ] **Step 4: Align empty state with tokens**

In `src/components/BlogSearch.tsx`, replace the empty-state block classes:

```tsx
<div className="rounded-2xl border border-dashed border-border bg-surface/40 p-8 text-center">
  <p className="text-lg font-semibold text-foreground">No posts found</p>
  <p className="mt-2 text-sm text-muted">
    Try a different title, topic, or tag.
  </p>
  <button
    type="button"
    onClick={() => setQuery("")}
    className="mt-5 rounded-full border border-accent/40 px-4 py-2 text-sm font-medium text-accent transition hover:border-accent hover:bg-accent/10"
  >
    Clear search
  </button>
</div>
```

- [ ] **Step 5: Remove orphaned `BlogList` only if unused**

Run:

```bash
rg "BlogList" src
```

Expected:

- If only `src/components/BlogList.tsx` declares it and no file imports it, delete `src/components/BlogList.tsx`.
- If another file imports it, do not delete it.

- [ ] **Step 6: Verify and commit**

Run:

```bash
npm run lint
npx tsc --noEmit
npm run build
git add src/app/blog/page.tsx src/components/BlogSearch.tsx src/components/BlogList.tsx
git commit -m "feat(blog): polish launch discovery path" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

Expected:

- Commands exit `0`.
- If `BlogList.tsx` was deleted, `git add` stages the deletion.

## Task 5: Make Now page freshness explicit

**Files:**
- Modify: `src/lib/constants.ts`
- Modify: `src/app/now/page.tsx`
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Add a static Now freshness constant**

In `src/lib/constants.ts`, after the `NOW` array, add:

```ts
export const NOW_LAST_UPDATED = "June 2026";
```

- [ ] **Step 2: Render the static freshness value**

In `src/app/now/page.tsx`, change the import:

```ts
import { SITE, NOW, NOW_LAST_UPDATED } from "@/lib/constants";
```

Replace the dynamic date line:

```tsx
Last updated: {NOW_LAST_UPDATED} ·{" "}
```

- [ ] **Step 3: Make sitemap dates intentional for static pages**

In `src/app/sitemap.ts`, define near the top of `sitemap()`:

```ts
const staticLastModified = new Date("2026-06-01");
```

Replace `new Date()` for static pages with `staticLastModified`:

```ts
{ url: siteUrl, lastModified: staticLastModified, changeFrequency: "monthly" as const, priority: 1 },
{ url: `${siteUrl}/about`, lastModified: staticLastModified, changeFrequency: "monthly" as const, priority: 0.8 },
{ url: `${siteUrl}/blog`, lastModified: staticLastModified, changeFrequency: "weekly" as const, priority: 0.8 },
{ url: `${siteUrl}/case-studies`, lastModified: staticLastModified, changeFrequency: "monthly" as const, priority: 0.7 },
{ url: `${siteUrl}/now`, lastModified: staticLastModified, changeFrequency: "monthly" as const, priority: 0.6 },
{ url: `${siteUrl}/resume`, lastModified: staticLastModified, changeFrequency: "monthly" as const, priority: 0.7 },
{ url: `${siteUrl}/uses`, lastModified: staticLastModified, changeFrequency: "monthly" as const, priority: 0.5 },
```

- [ ] **Step 4: Verify and commit**

Run:

```bash
npx tsc --noEmit
npm run build
git add src/lib/constants.ts src/app/now/page.tsx src/app/sitemap.ts
git commit -m "fix(now): use intentional freshness date" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

Expected:

- Commands exit `0`.

## Task 6: Enrich metadata and structured data

**Files:**
- Modify: `src/lib/constants.ts`
- Modify: `src/lib/jsonld.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/app/case-studies/[slug]/page.tsx`

- [ ] **Step 1: Add image and location to SITE**

In `src/lib/constants.ts`, update `SITE`:

```ts
export const SITE = {
  name: "Maksym Mishchenko",
  title: "Software Engineer II @ Microsoft Security",
  status: "Software Engineer II @ Microsoft Security",
  url: "https://mmishchenko.dev",
  image: "https://mmishchenko.dev/avatar.webp",
  location: "Prague, Czechia",
  github: "https://github.com/maksym-mishchenko",
  linkedin: "https://linkedin.com/in/maksym-mishchenko-1036381b8",
  email: "mailto:maksym@mmishchenko.dev",
} as const;
```

- [ ] **Step 2: Enrich `personSchema`**

In `src/lib/jsonld.ts`, replace `personSchema()` with:

```ts
export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    jobTitle: SITE.status,
    url: SITE.url,
    image: SITE.image,
    sameAs: [SITE.github, SITE.linkedin],
    worksFor: {
      "@type": "Organization",
      name: "Microsoft Security",
    },
    knowsAbout: [
      "Identity and access governance",
      "Application security",
      "Backend systems",
      "Developer tooling",
      "AI agent governance",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Prague",
      addressCountry: "CZ",
    },
  };
}
```

- [ ] **Step 3: Enrich article schemas with images and publisher**

In `blogPostingSchema`, add:

```ts
image: `${SITE.url}/blog/${post.slug}/opengraph-image`,
publisher: {
  "@type": "Person",
  name: SITE.name,
  url: SITE.url,
},
mainEntityOfPage: {
  "@type": "WebPage",
  "@id": `${SITE.url}/blog/${post.slug}`,
},
```

In `techArticleSchema`, add:

```ts
image: `${SITE.url}/opengraph-image`,
publisher: {
  "@type": "Person",
  name: SITE.name,
  url: SITE.url,
},
```

- [ ] **Step 4: Update root metadata share image**

In `src/app/layout.tsx`, add images to `openGraph` and `twitter`:

```ts
openGraph: {
  title: "Maksym Mishchenko — Software Engineer",
  description:
    "Software Engineer at Microsoft. Security-focused full-stack developer from Ukraine.",
  url: "https://mmishchenko.dev",
  siteName: "mmishchenko.dev",
  locale: "en_US",
  type: "website",
  images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Maksym Mishchenko portfolio" }],
},
twitter: {
  card: "summary_large_image",
  title: "Maksym Mishchenko — Software Engineer",
  description:
    "Software Engineer at Microsoft. Building tools that solve real problems.",
  images: ["/opengraph-image"],
},
```

- [ ] **Step 5: Add canonical URLs to article metadata**

In `src/app/blog/[slug]/page.tsx`, inside the metadata return add:

```ts
alternates: { canonical: `/blog/${post.slug}` },
openGraph: {
  title: post.title,
  description: post.description,
  url: `/blog/${post.slug}`,
  type: "article",
  publishedTime: post.date,
  tags: post.tags,
},
```

In `src/app/case-studies/[slug]/page.tsx`, inside the metadata return add:

```ts
alternates: { canonical: `/case-studies/${study.slug}` },
openGraph: {
  title: study.title,
  description: study.summary,
  url: `/case-studies/${study.slug}`,
  type: "article",
  publishedTime: study.date,
  tags: study.tags,
},
```

- [ ] **Step 6: Verify and commit**

Run:

```bash
npm run lint
npx tsc --noEmit
npm run build
git add src/lib/constants.ts src/lib/jsonld.ts src/app/layout.tsx src/app/blog/[slug]/page.tsx src/app/case-studies/[slug]/page.tsx
git commit -m "feat(seo): enrich launch metadata" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

Expected:

- Commands exit `0`.

## Task 7: Add repeatable launch smoke checks

**Files:**
- Create: `scripts/launch-smoke.sh`

- [ ] **Step 1: Create the smoke script**

Create `scripts/launch-smoke.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://127.0.0.1:3010}"

pages=(
  "/"
  "/about"
  "/resume"
  "/blog"
  "/case-studies"
  "/case-studies/mcpgate-v1-1"
  "/case-studies/mcpgate-v1-1/share"
  "/now"
  "/blog/feed.xml"
  "/sitemap.xml"
  "/robots.txt"
)

for path in "${pages[@]}"; do
  url="${BASE_URL}${path}"
  status="$(curl -sS -o /dev/null -w "%{http_code}" "$url")"
  if [[ "$status" != "200" ]]; then
    echo "FAIL $status $url"
    exit 1
  fi
  echo "OK $status $url"
done

contact_status="$(curl -sS -o /dev/null -w "%{http_code}" \
  -X POST "${BASE_URL}/api/contact" \
  -H "Content-Type: application/json" \
  --data '{"name":"","email":"not-an-email","message":""}')"

if [[ "$contact_status" != "400" && "$contact_status" != "429" ]]; then
  echo "FAIL $contact_status ${BASE_URL}/api/contact invalid input"
  exit 1
fi

echo "OK $contact_status ${BASE_URL}/api/contact invalid input"
```

- [ ] **Step 2: Make it executable**

Run:

```bash
chmod +x scripts/launch-smoke.sh
```

- [ ] **Step 3: Run against local dev server**

Start the dev server in one terminal:

```bash
npm run dev -- -p 3010
```

Run the smoke script in another terminal:

```bash
scripts/launch-smoke.sh http://127.0.0.1:3010
```

Expected:

- All page checks print `OK 200`.
- Contact invalid input prints `OK 400` or `OK 429`.

- [ ] **Step 4: Commit**

Run:

```bash
git add scripts/launch-smoke.sh
git commit -m "test: add launch smoke checks" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

## Task 8: Final launch QA, release docs, and version tag

**Files:**
- Modify: `CHANGELOG.md`
- Modify: `.agent/STATE.md`
- Modify: `package.json`
- Modify: `package-lock.json`
- Generate artifacts outside repo: `~/Documents/copilot-docs/portfolio-launch-screenshots/`

- [ ] **Step 1: Bump package version without tagging yet**

Run:

```bash
npm version 0.2.0 --no-git-tag-version
```

Expected:

- `package.json` and `package-lock.json` version fields are `0.2.0`.

- [ ] **Step 2: Update changelog**

In `CHANGELOG.md`, under `[Unreleased]`, add:

```md
- Public-launch hardening sprint: resume proof bullets, flagship case-study framing, blog discovery polish, intentional `/now` freshness, enriched metadata, and launch smoke checks.
```

Before tagging, convert `[Unreleased]` into:

```md
## [0.2.0] - 2026-06-07
```

Keep an empty `[Unreleased]` section above it:

```md
## [Unreleased]

## [0.2.0] - 2026-06-07
```

- [ ] **Step 3: Update `.agent/STATE.md`**

Add to Done:

```md
- Public-launch completion sprint complete: homepage credibility lift deployed, resume proof bullets, flagship case-study framing, blog discovery polish, static /now freshness, richer metadata, launch smoke checks, and v0.2.0 release prep.
```

Set In progress to:

```md
## In progress
- None.
```

Keep the existing ESLint 10 known issue.

- [ ] **Step 4: Run full local verification**

Run:

```bash
npm run lint
npx tsc --noEmit
npm run build
npm audit --audit-level=moderate
```

Expected:

- All commands exit `0`.

- [ ] **Step 5: Capture final screenshots**

Run local server:

```bash
npm run dev -- -p 3010
```

Capture screenshots:

```bash
mkdir -p "$HOME/Documents/copilot-docs/portfolio-launch-screenshots"
npx --yes playwright screenshot --viewport-size=375,1200 http://127.0.0.1:3010/ "$HOME/Documents/copilot-docs/portfolio-launch-screenshots/home-375.png"
npx --yes playwright screenshot --viewport-size=1280,1200 http://127.0.0.1:3010/ "$HOME/Documents/copilot-docs/portfolio-launch-screenshots/home-1280.png"
npx --yes playwright screenshot --viewport-size=1280,1200 http://127.0.0.1:3010/resume "$HOME/Documents/copilot-docs/portfolio-launch-screenshots/resume-1280.png"
npx --yes playwright screenshot --viewport-size=1280,1200 http://127.0.0.1:3010/blog "$HOME/Documents/copilot-docs/portfolio-launch-screenshots/blog-1280.png"
npx --yes playwright screenshot --viewport-size=1280,1200 http://127.0.0.1:3010/case-studies "$HOME/Documents/copilot-docs/portfolio-launch-screenshots/case-studies-1280.png"
npx --yes playwright screenshot --viewport-size=1280,1200 http://127.0.0.1:3010/now "$HOME/Documents/copilot-docs/portfolio-launch-screenshots/now-1280.png"
```

Expected:

- Six PNG files exist in `~/Documents/copilot-docs/portfolio-launch-screenshots/`.

- [ ] **Step 6: Run local smoke script**

Run:

```bash
scripts/launch-smoke.sh http://127.0.0.1:3010
```

Expected:

- All checks print `OK`.

- [ ] **Step 7: Commit release prep**

Run:

```bash
git add package.json package-lock.json CHANGELOG.md .agent/STATE.md
git commit -m "chore: prepare public launch release" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

- [ ] **Step 8: Push, open PR, and merge through GitHub**

Run:

```bash
git push
gh pr create --fill
```

If a PR already exists, update it instead:

```bash
gh pr view --web
```

Wait for CI and preview deploy. Merge only after checks pass.

- [ ] **Step 9: Verify live launch and tag**

After merge to `main` and Vercel production deployment:

```bash
git checkout main
git pull --ff-only
scripts/launch-smoke.sh https://mmishchenko.dev
git tag v0.2.0
git push origin v0.2.0
```

Expected:

- Live smoke checks pass.
- `v0.2.0` tag exists on origin.

## Final Definition of Done

The sprint is complete when:

- Homepage credibility lift is live.
- Resume, case studies, blog, and Now no longer feel thin or unfinished.
- Metadata and structured data are richer and verified by build/smoke checks.
- Launch smoke script exists and passes locally and live.
- Lint, typecheck, build, and moderate audit pass.
- Screenshots exist for key pages.
- Changelog, agent state, PR, and `v0.2.0` tag are complete.
