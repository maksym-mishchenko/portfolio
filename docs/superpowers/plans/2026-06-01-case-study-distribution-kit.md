# Case Study Distribution Kit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a recruiter-focused share kit for the mcpgate case study so Maksym can reuse polished positioning copy across LinkedIn, GitHub, resume bullets, and recruiter outreach.

**Architecture:** Add typed share-kit data in `src/lib/`, render it through a dedicated static `/case-studies/[slug]/share` route, and link to it from the existing case-study detail page. Keep the implementation server-rendered and dependency-free; no copy-to-clipboard button in v1 so the page remains useful without JavaScript.

**Tech Stack:** Next.js 16 App Router, React Server Components, TypeScript strict, Tailwind v4, existing case-study loader patterns.

---

## File Structure

- Create `src/lib/case-study-share-kits.ts`
  - Owns the typed share-kit content and lookup helpers.
  - Exports `CaseStudyShareKit`, `getShareKitBySlug`, and `getAllShareKitSlugs`.
- Create `src/app/case-studies/[slug]/share/page.tsx`
  - Renders the share-ready summary page.
  - Uses `notFound()` when the case study or share kit does not exist.
  - Generates static params from configured share kits.
- Modify `src/app/case-studies/[slug]/page.tsx`
  - Adds a "Share-ready summary" CTA when a share kit exists.
- Modify `src/app/sitemap.ts`
  - Adds share-kit URLs to the sitemap.
- Modify `.agent/STATE.md`
  - Records that the implementation plan exists and is ready to execute.

No homepage/project CTA is included in v1. The case-study page already has the correct audience context, and adding another homepage CTA risks cluttering the terminal aesthetic.

---

### Task 1: Add typed share-kit content

**Files:**
- Create: `src/lib/case-study-share-kits.ts`

- [x] **Step 1: Write the type and lookup helper skeleton**

Create `src/lib/case-study-share-kits.ts` with:

```ts
export interface CaseStudyShareKit {
  slug: string;
  positioning: string;
  recruiterSummary: string[];
  linkedinPost: string;
  githubBlurb: string;
  resumeBullet: string;
  recruiterMessage: string;
}

const SHARE_KITS: CaseStudyShareKit[] = [];

export function getShareKitBySlug(slug: string): CaseStudyShareKit | null {
  return SHARE_KITS.find((kit) => kit.slug === slug) ?? null;
}

export function getAllShareKitSlugs(): string[] {
  return SHARE_KITS.map((kit) => kit.slug);
}
```

- [x] **Step 2: Run type-check to verify the skeleton compiles**

Run:

```bash
npx tsc --noEmit
```

Expected: exits with code `0`.

- [x] **Step 3: Add the mcpgate share kit content**

Replace `const SHARE_KITS: CaseStudyShareKit[] = [];` with:

```ts
const SHARE_KITS: CaseStudyShareKit[] = [
  {
    slug: "mcpgate-v1-1",
    positioning:
      "I can identify and reduce AI-agent security risk before it becomes production damage.",
    recruiterSummary: [
      "Built mcpgate, a local governance gateway for AI-agent tool calls.",
      "Added injection heuristics, reverse-channel checks, and audit-friendly decisions without adding external services.",
      "Shipped a case study that explains the risk, design tradeoffs, validation path, and operational outcome.",
    ],
    linkedinPost:
      "I shipped a case study on mcpgate v1.1: a local governance gateway for AI-agent tool calls. The work focuses on a practical security problem: how to catch risky prompts, tool arguments, and reverse-channel behavior before an agent turns them into production-impacting actions. The key takeaway: I can identify and reduce AI-agent security risk before it becomes production damage.",
    githubBlurb:
      "Built mcpgate, a local AI-agent governance gateway focused on pre-flight policy checks, injection heuristics, reverse-channel risk detection, and audit-friendly decisions. The case study explains the security problem, implementation tradeoffs, and validation path.",
    resumeBullet:
      "Designed and shipped mcpgate v1.1, a local AI-agent governance gateway that reduces tool-call risk with pre-flight policy checks, injection heuristics, reverse-channel detection, and audit-ready decision records.",
    recruiterMessage:
      "Hi, I wanted to share a concise case study that represents the kind of engineering work I want to do next: identifying and reducing AI-agent security risk before it becomes production damage. It covers mcpgate v1.1, a local governance gateway for agent tool calls, including the problem, design tradeoffs, and validation path.",
  },
];
```

- [x] **Step 4: Re-run type-check**

Run:

```bash
npx tsc --noEmit
```

Expected: exits with code `0`.

- [x] **Step 5: Commit Task 1**

Run:

```bash
git add src/lib/case-study-share-kits.ts
git diff --cached
git commit -m "feat(case-studies): add share kit content" \
  -m "Add typed recruiter-facing share copy for the mcpgate case study so it can be reused by routes and metadata." \
  -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 2: Add the share route

**Files:**
- Create: `src/app/case-studies/[slug]/share/page.tsx`

- [x] **Step 1: Create the route**

Create `src/app/case-studies/[slug]/share/page.tsx` with:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCaseStudyBySlug } from "@/lib/case-studies";
import { getAllShareKitSlugs, getShareKitBySlug } from "@/lib/case-study-share-kits";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllShareKitSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  const shareKit = getShareKitBySlug(slug);

  if (!study || !shareKit) return {};

  return {
    title: `${study.project} share-ready summary - Maksym Mishchenko`,
    description: shareKit.positioning,
    openGraph: {
      title: `${study.project} share-ready summary`,
      description: shareKit.positioning,
      type: "article",
    },
  };
}

function ShareCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <h2 className="text-sm font-mono text-accent mb-3">{title}</h2>
      <div className="text-sm leading-relaxed text-muted whitespace-pre-line">{children}</div>
    </section>
  );
}

export default async function CaseStudySharePage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  const shareKit = getShareKitBySlug(slug);

  if (!study || !shareKit) notFound();

  return (
    <main id="main" className="max-w-3xl mx-auto px-6 py-20">
      <Link
        href={`/case-studies/${study.slug}`}
        className="text-sm text-muted hover:text-accent transition-colors"
      >
        &lt;- Back to case study
      </Link>

      <header className="mt-8 mb-10">
        <p className="text-sm font-mono text-accent mb-3">SHARE KIT / {study.project}</p>
        <h1 className="text-3xl sm:text-4xl font-bold font-heading mb-4">Share-ready summary</h1>
        <p className="text-lg text-muted leading-relaxed">{shareKit.positioning}</p>
      </header>

      <div className="space-y-4">
        <ShareCard title="Recruiter summary">
          <ul className="space-y-2">
            {shareKit.recruiterSummary.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </ShareCard>

        <ShareCard title="LinkedIn post">{shareKit.linkedinPost}</ShareCard>
        <ShareCard title="GitHub profile blurb">{shareKit.githubBlurb}</ShareCard>
        <ShareCard title="Resume bullet">{shareKit.resumeBullet}</ShareCard>
        <ShareCard title="Recruiter outreach message">{shareKit.recruiterMessage}</ShareCard>
      </div>
    </main>
  );
}
```

- [x] **Step 2: Run type-check**

Run:

```bash
npx tsc --noEmit
```

Expected: exits with code `0`.

- [x] **Step 3: Build and verify the route is generated**

Run:

```bash
npm run build
```

Expected: output includes:

```text
/case-studies/[slug]/share
/case-studies/mcpgate-v1-1/share
```

- [x] **Step 4: Commit Task 2**

Run:

```bash
git add src/app/case-studies/[slug]/share/page.tsx
git diff --cached
git commit -m "feat(case-studies): add share kit route" \
  -m "Render a static share-ready summary page for case studies with configured recruiter-facing copy." \
  -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 3: Link the share kit from the case study

**Files:**
- Modify: `src/app/case-studies/[slug]/page.tsx`

- [x] **Step 1: Add the share-kit lookup import**

Change the imports at the top of `src/app/case-studies/[slug]/page.tsx` from:

```ts
import { getAllCaseStudySlugs, getCaseStudyBySlug } from "@/lib/case-studies";
import { mdxComponents } from "@/components/mdx";
import { safeJsonLd, techArticleSchema } from "@/lib/jsonld";
```

to:

```ts
import { getAllCaseStudySlugs, getCaseStudyBySlug } from "@/lib/case-studies";
import { getShareKitBySlug } from "@/lib/case-study-share-kits";
import { mdxComponents } from "@/components/mdx";
import { safeJsonLd, techArticleSchema } from "@/lib/jsonld";
```

- [x] **Step 2: Load the share kit after the study**

Inside `CaseStudyPage`, change:

```ts
const study = getCaseStudyBySlug(slug);
if (!study) notFound();
```

to:

```ts
const study = getCaseStudyBySlug(slug);
if (!study) notFound();

const shareKit = getShareKitBySlug(slug);
```

- [x] **Step 3: Add the CTA in the header metadata row**

After the closing `</div>` for the tag list in the article header, add:

```tsx
{shareKit && (
  <Link
    href={`/case-studies/${study.slug}/share`}
    className="mt-6 inline-flex rounded-full border border-accent/40 px-4 py-2 text-sm text-accent transition-colors hover:border-accent hover:text-foreground"
  >
    Share-ready summary -&gt;
  </Link>
)}
```

The CTA should render before the `</header>` closing tag.

- [x] **Step 4: Run lint and type-check**

Run:

```bash
npm run lint
npx tsc --noEmit
```

Expected:

- `npm run lint` exits with code `0`. Existing warnings in unrelated files may still appear.
- `npx tsc --noEmit` exits with code `0`.

- [x] **Step 5: Commit Task 3**

Run:

```bash
git add src/app/case-studies/[slug]/page.tsx
git diff --cached
git commit -m "feat(case-studies): link share kit from case study" \
  -m "Expose the recruiter-focused share summary from the mcpgate case-study detail page when share copy exists." \
  -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 4: Add share-kit URLs to sitemap

**Files:**
- Modify: `src/app/sitemap.ts`

- [x] **Step 1: Import share-kit slugs and case-study lookup**

Change the imports from:

```ts
import { getAllCaseStudies } from "@/lib/case-studies";
import { SITE } from "@/lib/constants";
```

to:

```ts
import { getAllCaseStudies, getCaseStudyBySlug } from "@/lib/case-studies";
import { getAllShareKitSlugs } from "@/lib/case-study-share-kits";
import { SITE } from "@/lib/constants";
```

- [x] **Step 2: Build share-kit sitemap entries**

After `const caseStudies = getAllCaseStudies();`, add:

```ts
const shareKitSlugs = getAllShareKitSlugs();
```

After the `caseStudyEntries` declaration, add:

```ts
const shareKitEntries = shareKitSlugs.flatMap((slug) => {
  const study = getCaseStudyBySlug(slug);
  if (!study) return [];

  return [
    {
      url: `${siteUrl}/case-studies/${slug}/share`,
      lastModified: new Date(study.date),
    },
  ];
});
```

Using `flatMap` with a `getCaseStudyBySlug` guard ensures that share-kit slugs without a matching case-study file are silently skipped, and `new Date(study.date)` keeps the sitemap timestamp consistent with the actual content date rather than the build time.

- [x] **Step 3: Return share-kit entries**

Change the return list ending from:

```ts
...blogEntries,
...caseStudyEntries,
```

to:

```ts
...blogEntries,
...caseStudyEntries,
...shareKitEntries,
```

- [x] **Step 4: Run build**

Run:

```bash
npm run build
```

Expected: exits with code `0`.

- [x] **Step 5: Commit Task 4**

Run:

```bash
git add src/app/sitemap.ts
git diff --cached
git commit -m "feat(case-studies): include share kits in sitemap" \
  -m "Expose configured case-study share pages through the generated sitemap for discoverability." \
  -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 5: Final validation and PR

**Files:**
- Modify: `.agent/STATE.md`

- [x] **Step 1: Update agent state**

Ensure `.agent/STATE.md` records the implementation as complete with PR open. The final desired `In progress` line is:

```md
- Case-study distribution kit implemented on `feat/case-study-distribution-kit`; PR pending/open for `/case-studies/mcpgate-v1-1/share`.
```

- [x] **Step 2: Run full validation**

Run:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Expected:

- `npm run lint` exits with code `0`; existing unrelated warnings may remain.
- `npx tsc --noEmit` exits with code `0`.
- `npm run build` exits with code `0` and includes `/case-studies/mcpgate-v1-1/share`.

- [x] **Step 3: Review the final diff**

Run:

```bash
git status --short
git diff --stat origin/main...HEAD
git diff -- .agent/STATE.md
```

Expected:

- Only the distribution-kit implementation, the plan/spec docs, and `.agent/STATE.md` are changed.
- No dependencies are added.
- No secrets or credentials appear in the diff.

- [x] **Step 4: Commit final state update**

Run:

```bash
git add .agent/STATE.md
git diff --cached
git commit -m "docs(case-studies): update share kit state" \
  -m "Record the implementation status for the mcpgate share-ready summary after validation." \
  -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

- [x] **Step 5: Push and open PR**

Run:

```bash
git push -u origin feat/case-study-distribution-kit
gh pr create \
  --title "feat(case-studies): add mcpgate share kit" \
  --body "## Summary
- Add typed share-kit content for the mcpgate flagship case study
- Add a static share-ready summary route
- Link the share kit from the case-study page and sitemap

## Test Plan
- [ ] npm run lint
- [ ] npx tsc --noEmit
- [ ] npm run build"
```

Expected: GitHub returns a PR URL.

---

## Self-Review

- Spec coverage: The plan covers typed copy storage, a dedicated route, case-study CTA, sitemap discoverability, no new dependencies, no automatic posting, and no copy button in v1.
- Placeholder scan: The plan contains no TBD/TODO placeholders or vague implementation steps.
- Type consistency: The same `CaseStudyShareKit`, `getShareKitBySlug`, and `getAllShareKitSlugs` names are used across all tasks.
- Scope check: This is one focused subsystem: rendering a share-ready summary for an existing case study.
