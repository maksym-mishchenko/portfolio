# Homepage Credibility Lift Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the homepage communicate identity, proof, and recruiter-friendly actions immediately while preserving the dark terminal/security aesthetic.

**Architecture:** Keep the homepage structure intact and make surgical component changes. `Hero` will render visible identity and CTAs immediately instead of gating all actions on terminal completion. `About` will reuse existing `ABOUT.focusAreas` and `ABOUT.proofLinks` content from `src/lib/constants.ts` so homepage proof stays consistent with `/about`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4 utility classes, Framer Motion, Vercel Analytics.

---

## File Structure

- Modify `src/components/Hero.tsx`: visible hero identity, positioning line, immediate CTA row, Resume CTA, terminal remains animated.
- Modify `src/components/About.tsx`: import `ABOUT`, add compact proof cards and links under the existing homepage bio/social block.
- No new dependencies and no new route files.

## Tasks

### Task 1: Immediate hero identity and CTAs

**Files:**
- Modify: `src/components/Hero.tsx`

- [ ] **Step 1: Replace the hero layout with visible identity and immediate CTAs**

Update `Hero` so it no longer hides the full CTA row behind `typingDone`. Keep `typingDone` only for a small completion hint if needed. The visible content should include:

```tsx
<h1 className="text-4xl font-bold tracking-tight text-[#fafafa] sm:text-5xl lg:text-6xl">
  Maksym Mishchenko
</h1>
<p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#a1a1aa] sm:text-xl">
  Security-minded software engineer building identity systems, developer tooling, and governed AI-agent automation.
</p>
```

Render CTAs immediately:

```tsx
<Link href="/resume">Resume</Link>
<button>Projects</button>
<Link href="/blog">Blog</Link>
<a href={SITE.github}>GitHub</a>
```

Tracking labels must be `resume`, `projects`, `blog`, and `github`.

- [ ] **Step 2: Preserve terminal personality**

Keep the status badge and terminal card, but make the card a supporting element below the visible heading and CTA row. Increase maximum width on large screens to reduce wide-screen dead space:

```tsx
<div className="mx-auto mt-10 w-full max-w-3xl ...">
```

- [ ] **Step 3: Run focused validation**

Run:

```bash
npx tsc --noEmit
```

Expected: exits `0`.

### Task 2: Homepage About proof cards

**Files:**
- Modify: `src/components/About.tsx`

- [ ] **Step 1: Import existing proof content**

Change the constants import to:

```tsx
import { ABOUT, SITE } from "@/lib/constants";
```

- [ ] **Step 2: Render compact focus-area cards**

After the existing bio/social links, render a compact section using `ABOUT.focusAreas.map`. Each card must show `area.title`, `area.description`, and `area.proof`.

Use the existing dark design language:

```tsx
<div className="mt-10 grid gap-4 md:grid-cols-3">
  {ABOUT.focusAreas.map((area) => (
    <article key={area.title} className="rounded-xl border border-border bg-surface/40 p-5">
      <h3 className="text-base font-semibold text-foreground">{area.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted">{area.description}</p>
      <p className="mt-4 text-sm leading-relaxed text-accent">{area.proof}</p>
    </article>
  ))}
</div>
```

- [ ] **Step 3: Add onward proof links**

Render `ABOUT.proofLinks` below the cards as small pill links. Use `next/link` for internal paths. Keep existing GitHub/LinkedIn/Email links unchanged.

- [ ] **Step 4: Run focused validation**

Run:

```bash
npx tsc --noEmit
```

Expected: exits `0`.

### Task 3: Full verification

**Files:**
- Inspect: `src/components/Hero.tsx`
- Inspect: `src/components/About.tsx`

- [ ] **Step 1: Run lint**

Run:

```bash
npm run lint
```

Expected: exits `0`.

- [ ] **Step 2: Run typecheck**

Run:

```bash
npx tsc --noEmit
```

Expected: exits `0`.

- [ ] **Step 3: Run production build**

Run:

```bash
npm run build
```

Expected: exits `0`.

- [ ] **Step 4: Review diff**

Run:

```bash
git --no-pager diff -- src/components/Hero.tsx src/components/About.tsx
```

Expected: only the homepage credibility lift is changed.
