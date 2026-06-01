# Case Studies Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a portfolio case-study section with one flagship mcpgate v1.1.0 case study that presents AI-agent security risk reduction as clear hiring signal.

**Architecture:** Reuse the existing blog pattern: MDX content in `content/case-studies/`, a typed filesystem loader in `src/lib/`, static App Router pages, metadata, and JSON-LD. Project promotion stays data-driven by extending the `Project` model with an internal `caseStudySlug` link and rendering a card CTA when present.

**Tech Stack:** Next.js 16 App Router, React 19 Server Components by default, TypeScript strict, Tailwind v4, `gray-matter`, `next-mdx-remote/rsc`, existing MDX components, existing Vercel deployment.

**Spec:** `docs/superpowers/specs/2026-06-01-case-studies-design.md`

**Repo:** `maksym-mishchenko/portfolio` (local checkout: `/Users/maksymmishchenko/Projects/portfolio`).

**Conventions:**
- Work on a feature branch, not `main`: `feat/case-studies`.
- Co-author trailer on every commit: `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`.
- No new runtime dependencies.
- Use `async/await`, no `.then()` chains.
- Keep pages as Server Components unless interactivity is required.

---

## File Structure

| File | Responsibility | Create/Modify |
|------|----------------|---------------|
| `content/case-studies/mcpgate-v1-1.mdx` | Flagship case-study content and frontmatter | Create |
| `src/lib/case-studies.ts` | Typed MDX filesystem loader, slug lookup, sorting, reading time | Create |
| `src/app/case-studies/page.tsx` | Case-study index page | Create |
| `src/app/case-studies/[slug]/page.tsx` | Case-study detail route, MDX rendering, metadata, JSON-LD injection | Create |
| `src/lib/jsonld.ts` | Add `TechArticle` structured-data helper | Modify |
| `src/lib/constants.ts` | Add `caseStudySlug` to `Project`; add mcpgate project card data | Modify |
| `src/components/Projects.tsx` | Render internal `Case study` CTA when project has `caseStudySlug` | Modify |
| `src/components/SiteHeader.tsx` | Add `Case Studies` nav link on non-home pages | Modify |
| `src/components/StickyNav.tsx` | Add `Case Studies` link to homepage sticky navigation | Modify |
| `src/app/sitemap.ts` | Add case-study index and detail URLs | Modify |

---

## Task 1: Add case-study content model, loader, and index route

**Files:**
- Create: `content/case-studies/mcpgate-v1-1.mdx`
- Create: `src/lib/case-studies.ts`
- Create: `src/app/case-studies/page.tsx`

- [ ] **Step 1: Start from a feature branch**

Run:

```bash
cd /Users/maksymmishchenko/Projects/portfolio
git switch -c feat/case-studies
```

Expected: branch changes to `feat/case-studies`.

- [ ] **Step 2: Write the failing route contract**

Create `src/app/case-studies/page.tsx` with this temporary index page. It imports the loader before the loader exists so TypeScript proves the route contract.

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { getAllCaseStudies } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "Case Studies - Maksym Mishchenko",
  description:
    "Deep dives into shipped engineering work, security tradeoffs, architecture decisions, and release outcomes.",
};

export default function CaseStudiesPage() {
  const caseStudies = getAllCaseStudies();

  return (
    <main id="main" className="max-w-3xl mx-auto px-6 py-20">
      <p className="text-sm font-mono text-accent mb-3">CASE STUDIES</p>
      <h1 className="text-4xl font-bold font-heading mb-4">Engineering work, explained.</h1>
      <p className="text-muted mb-10">
        Focused breakdowns of problems I shipped: what risk existed, what constraints mattered,
        what changed, and how the outcome was verified.
      </p>

      <div className="space-y-4">
        {caseStudies.map((study) => (
          <Link
            key={study.slug}
            href={`/case-studies/${study.slug}`}
            className="group block rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent/50"
          >
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-muted">
                <span>{study.project}</span>
                <span aria-hidden="true">/</span>
                <time dateTime={study.date}>
                  {new Date(study.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
              <h2 className="text-2xl font-semibold group-hover:text-accent transition-colors">
                {study.title}
              </h2>
              <p className="text-sm text-muted leading-relaxed">{study.summary}</p>
              <div className="flex flex-wrap gap-2">
                {study.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-accent">Read case study -&gt;</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Run typecheck to verify it fails**

Run:

```bash
cd /Users/maksymmishchenko/Projects/portfolio
npx tsc --noEmit
```

Expected: FAIL with `Cannot find module '@/lib/case-studies'`.

- [ ] **Step 4: Add the mcpgate case-study MDX content**

Create `content/case-studies/mcpgate-v1-1.mdx`:

```mdx
---
title: "mcpgate v1.1.0: Securing AI Agent Tool Calls"
slug: "mcpgate-v1-1"
summary: "How I shipped reverse-channel prompt-injection defenses for an MCP security gateway, caught an error-channel bypass in review, and released a safer v1.1.0."
project: "mcpgate"
date: "2026-06-01"
tags:
  - AI Security
  - MCP
  - Go
  - Agent Governance
outcome:
  - "Identified reverse-channel prompt-injection risk in tool results"
  - "Shipped deterministic inbound gating for result and error channels"
  - "Verified the release with regression coverage before publishing v1.1.0"
---

## Executive summary

mcpgate v1.1.0 reduced a practical AI-agent security risk: malicious or compromised tools could return instructions that look like ordinary tool output but are actually prompt injection aimed at the agent.

The fix was not another prompt. I added deterministic reverse-channel gating so warning content is detected before it reaches the agent, preserved the audit trail, and verified both successful and blocked paths before release.

## Why this mattered

AI agents do not only receive instructions from users. They also receive data from tools. If a tool result says "ignore previous instructions" or attempts to leak credentials, that content can influence the next model step unless the gateway treats inbound tool output as untrusted.

For mcpgate, the product promise is simple: route MCP traffic through a security gateway that can inspect, decide, and record what happened. v1.1.0 extended that promise from outbound requests to inbound tool responses.

## Threat model

The main risk was reverse-channel prompt injection: unsafe instructions hidden inside tool responses. The gateway needed to catch high-signal patterns without introducing an LLM dependency or turning the CLI into a complex policy service.

The design used deterministic heuristics because they are local, reviewable, cheap to run, and easy to test. The tradeoff is that heuristics are not a complete security boundary, so the release framed them as risk reduction and audit signal rather than perfect detection.

## Constraints

- No LLM dependency in the hot path.
- Local-first CLI behavior.
- Fail-closed behavior when `block_on_warn` is enabled.
- Audit entries must explain what happened.
- Human approval boundaries must remain explicit.
- No secrets should be committed or logged as implementation artifacts.

## Architecture

The gateway scans outbound tool calls and inbound tool responses. When the scanner finds known prompt-injection or exfiltration signatures, it records a warning. In observe mode, warnings are visible in audit output. With `block_on_warn` enabled, the gateway blocks warned inbound content before it reaches the agent.

The important architecture decision was symmetry: both successful tool results and error responses are untrusted input. A tool can poison either channel, so both channels need the same inspection path.

## Review finding

During review, I found that the first implementation scanned `resp.Result` but missed `resp.Error`. That left a bypass where unsafe instructions could be returned as an error and still reach the agent.

The fix was to scan both channels and add regression coverage for the error path. That review loop is the part of the story that matters most: the goal was not just to ship the feature, but to catch the bypass before release.

## Release outcome

The release moved to the fixed commit before publishing v1.1.0. The final version included reverse-channel gating, audit warnings, and regression coverage for the result and error paths.

## What this demonstrates

- Security mindset: model tool output as untrusted input.
- Product judgment: ship deterministic risk reduction without overbuilding.
- Review discipline: find and fix bypasses before release.
- Engineering communication: document the security boundary and remaining limits.

## Next steps

The next useful improvements are stronger policy configuration, fuzz cases for scanner inputs, and broader transport coverage. Those are follow-up releases, not prerequisites for the first public case study.
```

- [ ] **Step 5: Add the typed loader**

Create `src/lib/case-studies.ts`:

```ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface CaseStudy {
  slug: string;
  title: string;
  summary: string;
  project: string;
  date: string;
  tags: string[];
  outcome: string[];
  readingTime: string;
  content: string;
}

export type CaseStudyMeta = Omit<CaseStudy, "content">;

const CASE_STUDIES_DIR = path.join(process.cwd(), "content", "case-studies");

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return `${minutes} min read`;
}

function stringField(data: Record<string, unknown>, key: string, slug: string): string {
  const value = data[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Case study "${slug}" is missing required string field "${key}".`);
  }
  return value;
}

function stringArrayField(data: Record<string, unknown>, key: string, slug: string): string[] {
  const value = data[key];
  if (!Array.isArray(value) || value.length === 0 || !value.every((item) => typeof item === "string")) {
    throw new Error(`Case study "${slug}" is missing required string array field "${key}".`);
  }
  return value;
}

function readCaseStudyFile(filename: string): CaseStudy {
  const fileSlug = filename.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(CASE_STUDIES_DIR, filename), "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = data as Record<string, unknown>;
  const slug = stringField(frontmatter, "slug", fileSlug);

  if (slug !== fileSlug) {
    throw new Error(`Case study "${fileSlug}" has frontmatter slug "${slug}". Slug must match filename.`);
  }

  return {
    slug,
    title: stringField(frontmatter, "title", slug),
    summary: stringField(frontmatter, "summary", slug),
    project: stringField(frontmatter, "project", slug),
    date: stringField(frontmatter, "date", slug),
    tags: stringArrayField(frontmatter, "tags", slug),
    outcome: stringArrayField(frontmatter, "outcome", slug),
    readingTime: calculateReadingTime(content),
    content,
  };
}

export function getAllCaseStudies(): CaseStudyMeta[] {
  if (!fs.existsSync(CASE_STUDIES_DIR)) return [];

  return fs
    .readdirSync(CASE_STUDIES_DIR)
    .filter((filename) => filename.endsWith(".mdx"))
    .map(readCaseStudyFile)
    .map(({ content: _content, ...meta }) => meta)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getCaseStudyBySlug(slug: string): CaseStudy | null {
  const filePath = path.join(CASE_STUDIES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return readCaseStudyFile(`${slug}.mdx`);
}

export function getAllCaseStudySlugs(): string[] {
  if (!fs.existsSync(CASE_STUDIES_DIR)) return [];

  return fs
    .readdirSync(CASE_STUDIES_DIR)
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => filename.replace(/\.mdx$/, ""));
}
```

- [ ] **Step 6: Run checks for Task 1**

Run:

```bash
cd /Users/maksymmishchenko/Projects/portfolio
npx tsc --noEmit
npm run lint
```

Expected: both commands pass.

- [ ] **Step 7: Commit Task 1**

Run:

```bash
cd /Users/maksymmishchenko/Projects/portfolio
git add content/case-studies/mcpgate-v1-1.mdx src/lib/case-studies.ts src/app/case-studies/page.tsx
git commit -m "feat(case-studies): add mcpgate case study index

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 2: Add the case-study detail route and TechArticle JSON-LD

**Files:**
- Create: `src/app/case-studies/[slug]/page.tsx`
- Modify: `src/lib/jsonld.ts`

- [ ] **Step 1: Write the failing detail route**

Create `src/app/case-studies/[slug]/page.tsx`. It calls `techArticleSchema` before that helper exists.

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllCaseStudySlugs, getCaseStudyBySlug } from "@/lib/case-studies";
import { mdxComponents } from "@/components/mdx";
import { techArticleSchema } from "@/lib/jsonld";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) return {};

  return {
    title: `${study.title} - Maksym Mishchenko`,
    description: study.summary,
    openGraph: {
      title: study.title,
      description: study.summary,
      type: "article",
      publishedTime: study.date,
      tags: study.tags,
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) notFound();

  return (
    <main id="main" className="max-w-3xl mx-auto px-6 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(techArticleSchema(study)),
        }}
      />

      <Link href="/case-studies" className="text-sm text-muted hover:text-accent transition-colors">
        &lt;- Back to case studies
      </Link>

      <article className="mt-8">
        <header className="mb-10">
          <p className="text-sm font-mono text-accent mb-3">CASE STUDY / {study.project}</p>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading mb-4">{study.title}</h1>
          <p className="text-lg text-muted leading-relaxed mb-5">{study.summary}</p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
            <time dateTime={study.date}>
              {new Date(study.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span aria-hidden="true">/</span>
            <span>{study.readingTime}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-4">
            {study.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-surface border border-border text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <section className="mb-10 rounded-xl border border-accent/30 bg-accent/5 p-5">
          <h2 className="text-sm font-mono text-accent mb-4">Risk reduction summary</h2>
          <ul className="space-y-3">
            {study.outcome.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="prose-custom">
          <MDXRemote source={study.content} components={mdxComponents} />
        </div>
      </article>

      <div className="mt-16 pt-8 border-t border-border">
        <Link href="/projects" className="text-sm text-muted hover:text-accent transition-colors">
          View more projects -&gt;
        </Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Run typecheck to verify it fails**

Run:

```bash
cd /Users/maksymmishchenko/Projects/portfolio
npx tsc --noEmit
```

Expected: FAIL with `Module '"@/lib/jsonld"' has no exported member 'techArticleSchema'`.

- [ ] **Step 3: Add the TechArticle schema helper**

Append this function to `src/lib/jsonld.ts`:

```ts
export function techArticleSchema(study: {
  title: string;
  summary: string;
  date: string;
  slug: string;
  tags: string[];
}) {
  const url = `${SITE.url}/case-studies/${study.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: study.title,
    description: study.summary,
    datePublished: study.date,
    author: {
      "@type": "Person",
      name: SITE.name,
      url: SITE.url,
    },
    keywords: study.tags,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
  };
}
```

- [ ] **Step 4: Fix the closing CTA link**

In `src/app/case-studies/[slug]/page.tsx`, replace the closing CTA href from `"/projects"` to `"/#projects"` because this repo has a homepage section, not a `/projects` route:

```tsx
<Link href="/#projects" className="text-sm text-muted hover:text-accent transition-colors">
  View more projects -&gt;
</Link>
```

- [ ] **Step 5: Run checks for Task 2**

Run:

```bash
cd /Users/maksymmishchenko/Projects/portfolio
npx tsc --noEmit
npm run lint
```

Expected: both commands pass.

- [ ] **Step 6: Commit Task 2**

Run:

```bash
cd /Users/maksymmishchenko/Projects/portfolio
git add src/app/case-studies/[slug]/page.tsx src/lib/jsonld.ts
git commit -m "feat(case-studies): add mcpgate detail page

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 3: Promote the case study from project cards

**Files:**
- Modify: `src/lib/constants.ts`
- Modify: `src/components/Projects.tsx`

- [ ] **Step 1: Add failing project data**

In `src/lib/constants.ts`, add a new mcpgate project object at the top of `PROJECTS`. Keep the `caseStudySlug` field even though `Project` does not support it yet:

```ts
  {
    title: "mcpgate",
    description:
      "Security gateway for MCP tool calls with policy enforcement, audit trails, and reverse-channel prompt-injection defenses.",
    tech: ["Go", "MCP", "AI Security", "SQLite"],
    github: "https://github.com/maksym-mishchenko/mcpgate",
    featured: true,
    learned: "Agent tool output is untrusted input; security controls need to inspect both result and error channels.",
    caseStudySlug: "mcpgate-v1-1",
  },
```

- [ ] **Step 2: Run typecheck to verify it fails**

Run:

```bash
cd /Users/maksymmishchenko/Projects/portfolio
npx tsc --noEmit
```

Expected: FAIL with `Object literal may only specify known properties, and 'caseStudySlug' does not exist in type 'Project'`.

- [ ] **Step 3: Extend the Project interface**

In `src/lib/constants.ts`, add this property to `Project`:

```ts
  caseStudySlug?: string;
```

- [ ] **Step 4: Render the case-study CTA**

At the top of `src/components/Projects.tsx`, add:

```tsx
import Link from "next/link";
```

In `ProjectCard`, replace the link row with this version:

```tsx
        <div className="flex flex-wrap gap-3">
          {project.caseStudySlug && (
            <Link
              href={`/case-studies/${project.caseStudySlug}`}
              onClick={() => track("project_click", { project: project.title, type: "case_study" })}
              className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-foreground transition-colors"
            >
              Case study
            </Link>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("project_click", { project: project.title, type: "github" })}
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
            >
              <GithubIcon size={16} />
              Code
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("project_click", { project: project.title, type: "live" })}
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
            >
              <ExternalLink size={16} />
              Live
            </a>
          )}
        </div>
```

- [ ] **Step 5: Run checks for Task 3**

Run:

```bash
cd /Users/maksymmishchenko/Projects/portfolio
npx tsc --noEmit
npm run lint
```

Expected: both commands pass.

- [ ] **Step 6: Commit Task 3**

Run:

```bash
cd /Users/maksymmishchenko/Projects/portfolio
git add src/lib/constants.ts src/components/Projects.tsx
git commit -m "feat(projects): promote mcpgate case study

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 4: Add navigation and sitemap discoverability

**Files:**
- Modify: `src/components/SiteHeader.tsx`
- Modify: `src/components/StickyNav.tsx`
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Add the non-home navigation link**

In `src/components/SiteHeader.tsx`, replace `LINKS` with:

```tsx
const LINKS = [
  { label: "Blog", href: "/blog" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Now", href: "/now" },
  { label: "Resume", href: "/resume" },
  { label: "Uses", href: "/uses" },
];
```

- [ ] **Step 2: Add the homepage sticky navigation link**

In `src/components/StickyNav.tsx`, replace `NAV_LINKS` with:

```tsx
const NAV_LINKS = [
  { label: "Projects", href: "#projects" },
  { label: "Journey", href: "#journey" },
  { label: "Stack", href: "#stack" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
  { label: "Blog", href: "/blog" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Now", href: "/now" },
  { label: "Resume", href: "/resume" },
  { label: "Uses", href: "/uses" },
];
```

- [ ] **Step 3: Update the sitemap**

In `src/app/sitemap.ts`, replace the file with:

```ts
import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { getAllCaseStudies } from "@/lib/case-studies";
import { SITE } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = SITE.url;
  const posts = getAllPosts();
  const caseStudies = getAllCaseStudies();

  const blogEntries = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  const caseStudyEntries = caseStudies.map((study) => ({
    url: `${siteUrl}/case-studies/${study.slug}`,
    lastModified: new Date(study.date),
  }));

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 1 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${siteUrl}/case-studies`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${siteUrl}/now`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${siteUrl}/resume`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${siteUrl}/uses`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    ...blogEntries,
    ...caseStudyEntries,
  ];
}
```

- [ ] **Step 4: Run checks for Task 4**

Run:

```bash
cd /Users/maksymmishchenko/Projects/portfolio
npx tsc --noEmit
npm run lint
```

Expected: both commands pass.

- [ ] **Step 5: Commit Task 4**

Run:

```bash
cd /Users/maksymmishchenko/Projects/portfolio
git add src/components/SiteHeader.tsx src/components/StickyNav.tsx src/app/sitemap.ts
git commit -m "feat(case-studies): add navigation and sitemap entries

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 5: Final validation and pull request

**Files:**
- Verify: all files changed by Tasks 1-4
- Update if needed: `.agent/STATE.md`

- [ ] **Step 1: Run full validation**

Run:

```bash
cd /Users/maksymmishchenko/Projects/portfolio
npm run lint
npx tsc --noEmit
npm run build
```

Expected: all commands pass. `npm run build` should include generated static pages for `/case-studies` and `/case-studies/mcpgate-v1-1`.

- [ ] **Step 2: Inspect the built route output**

Run:

```bash
cd /Users/maksymmishchenko/Projects/portfolio
npm run build -- --no-lint
```

Expected: build still succeeds. If `--no-lint` is not supported by the installed Next.js version, use only the successful output from Step 1.

- [ ] **Step 3: Review page content manually in dev server**

Run:

```bash
cd /Users/maksymmishchenko/Projects/portfolio
npm run dev
```

Open:

```text
http://localhost:3000/case-studies
http://localhost:3000/case-studies/mcpgate-v1-1
http://localhost:3000/#projects
```

Expected:
- `/case-studies` shows the mcpgate card.
- `/case-studies/mcpgate-v1-1` shows the risk-reduction summary and MDX body.
- The mcpgate project card has a `Case study` CTA.
- Navigation includes `Case Studies`.
- No horizontal overflow appears on mobile width.

- [ ] **Step 4: Update agent state**

If `.agent/STATE.md` exists, add one line to the active work section:

```md
- Case-study implementation planned and ready for PR execution; first flagship is mcpgate v1.1.0.
```

- [ ] **Step 5: Commit agent state only if it changed**

Run:

```bash
cd /Users/maksymmishchenko/Projects/portfolio
git status --short
```

If `.agent/STATE.md` changed:

```bash
git add .agent/STATE.md
git commit -m "docs(agent): record case-study implementation state

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

If `.agent/STATE.md` did not change, do not create this commit.

- [ ] **Step 6: Push and open the PR**

Run:

```bash
cd /Users/maksymmishchenko/Projects/portfolio
git push -u origin feat/case-studies
gh pr create \
  --title "feat(case-studies): add mcpgate flagship case study" \
  --body "## Summary
- add /case-studies index and /case-studies/mcpgate-v1-1 detail page
- add typed MDX case-study loader and TechArticle JSON-LD
- promote mcpgate from project cards and sitemap

## Validation
- npm run lint
- npx tsc --noEmit
- npm run build"
```

Expected: GitHub returns a PR URL.

---

## Self-Review

- Spec coverage: the plan covers `/case-studies`, `/case-studies/mcpgate-v1-1`, MDX storage, metadata, JSON-LD, project-card promotion, sitemap discoverability, no CMS/search/filters/multiple case studies, and no new dependencies.
- Placeholder scan: no unfinished-marker text or unspecified code steps remain.
- Type consistency: `CaseStudy`, `CaseStudyMeta`, `caseStudySlug`, `getAllCaseStudies`, `getCaseStudyBySlug`, `getAllCaseStudySlugs`, and `techArticleSchema` are named consistently across tasks.
- Scope check: the plan implements one case-study subsystem and does not include extra theme work, analytics, search, filters, CMS, or image-generation work.
