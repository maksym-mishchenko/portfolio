# Personal Website Critique Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce an evidence-backed critique of `mmishchenko.dev` across recruiter clarity, senior-engineer credibility, professional trust, and blog-reader personality.

**Architecture:** This is a review/report workflow, not a code-change workflow. Run the site locally, capture visual evidence across representative pages and viewports, inspect source/content for credibility and conversion paths, then write a prioritized report in the user-readable docs folder.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, local `next dev`, Playwright CLI screenshots via `npx`, Markdown report output.

---

## File Structure

- Read: `docs/superpowers/specs/2026-06-02-personal-website-critique-design.md` — approved review scope and success criteria.
- Read: `src/app/page.tsx` — homepage section order.
- Read: `src/components/Hero.tsx` — first-screen positioning and CTAs.
- Read: `src/components/Projects.tsx` — project card layout and conversion paths.
- Read: `src/components/About.tsx` — professional narrative and credibility copy.
- Read: `src/components/Contact.tsx` — contact conversion flow.
- Read: `src/lib/constants.ts` — source of truth for personal data, projects, journey, stack, and about content.
- Read: `src/app/blog/page.tsx`, `src/components/BlogSearch.tsx`, `src/components/BlogList.tsx` — blog discovery and reader flow.
- Read: `src/app/resume/page.tsx` and `src/app/now/page.tsx` — recruiter/professional proof surfaces.
- Read: `src/app/case-studies/page.tsx` and `src/app/case-studies/[slug]/page.tsx` — senior-engineer proof depth.
- Create outside repo: `~/Documents/copilot-docs/portfolio-website-critique-2026-06-02.md` — final readable critique report.
- Create outside repo: `~/Documents/copilot-docs/portfolio-critique-screenshots/` — screenshot evidence folder.

Do not modify product source files during this plan. The only repo changes for the planning phase are this plan and the already-approved design spec.

---

### Task 1: Prepare the Review Environment

**Files:**
- Read: `docs/superpowers/specs/2026-06-02-personal-website-critique-design.md`
- Create outside repo: `~/Documents/copilot-docs/portfolio-critique-screenshots/`

- [ ] **Step 1: Confirm clean repo state**

Run:

```bash
git --no-pager status --short --branch
```

Expected: current branch is the plan branch or `main`; no unrelated uncommitted product-code changes.

- [ ] **Step 2: Create the report artifact directories**

Run:

```bash
mkdir -p "$HOME/Documents/copilot-docs/portfolio-critique-screenshots"
```

Expected: command exits with status 0.

- [ ] **Step 3: Start the local site**

Run in async/background mode:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3010
```

Expected: output includes a ready message and the app is reachable at `http://127.0.0.1:3010`.

- [ ] **Step 4: Verify the homepage responds**

Run:

```bash
curl -I http://127.0.0.1:3010/
```

Expected: `HTTP/1.1 200 OK` or another 2xx response.

- [ ] **Step 5: Record review inputs**

Run:

```bash
printf '%s\n' \
  'Review lens: balanced scorecard across recruiter clarity, senior-engineer credibility, professional trust, and blog-reader personality.' \
  'Primary URL: http://127.0.0.1:3010' \
  'Report: ~/Documents/copilot-docs/portfolio-website-critique-2026-06-02.md'
```

Expected: these lines are visible in the terminal for the reviewer to copy into notes.

---

### Task 2: Capture Visual Evidence

**Files:**
- Create outside repo: `~/Documents/copilot-docs/portfolio-critique-screenshots/*.png`

- [ ] **Step 1: Capture homepage screenshots**

Run:

```bash
SCREEN_DIR="$HOME/Documents/copilot-docs/portfolio-critique-screenshots"
npx --yes playwright@latest screenshot --viewport-size=375,900 http://127.0.0.1:3010/ "$SCREEN_DIR/home-375.png"
npx --yes playwright@latest screenshot --viewport-size=768,1024 http://127.0.0.1:3010/ "$SCREEN_DIR/home-768.png"
npx --yes playwright@latest screenshot --viewport-size=1280,900 http://127.0.0.1:3010/ "$SCREEN_DIR/home-1280.png"
npx --yes playwright@latest screenshot --viewport-size=1920,1080 http://127.0.0.1:3010/ "$SCREEN_DIR/home-1920.png"
```

Expected: four PNG files are created.

- [ ] **Step 2: Capture proof-path pages**

Run:

```bash
SCREEN_DIR="$HOME/Documents/copilot-docs/portfolio-critique-screenshots"
npx --yes playwright@latest screenshot --viewport-size=1280,900 http://127.0.0.1:3010/about "$SCREEN_DIR/about-1280.png"
npx --yes playwright@latest screenshot --viewport-size=1280,900 http://127.0.0.1:3010/resume "$SCREEN_DIR/resume-1280.png"
npx --yes playwright@latest screenshot --viewport-size=1280,900 http://127.0.0.1:3010/case-studies "$SCREEN_DIR/case-studies-1280.png"
npx --yes playwright@latest screenshot --viewport-size=1280,900 http://127.0.0.1:3010/case-studies/mcpgate-v1-1 "$SCREEN_DIR/mcpgate-1280.png"
npx --yes playwright@latest screenshot --viewport-size=1280,900 http://127.0.0.1:3010/blog "$SCREEN_DIR/blog-1280.png"
npx --yes playwright@latest screenshot --viewport-size=1280,900 http://127.0.0.1:3010/now "$SCREEN_DIR/now-1280.png"
```

Expected: six PNG files are created.

- [ ] **Step 3: Capture mobile proof-path pages**

Run:

```bash
SCREEN_DIR="$HOME/Documents/copilot-docs/portfolio-critique-screenshots"
npx --yes playwright@latest screenshot --viewport-size=375,900 http://127.0.0.1:3010/about "$SCREEN_DIR/about-375.png"
npx --yes playwright@latest screenshot --viewport-size=375,900 http://127.0.0.1:3010/blog "$SCREEN_DIR/blog-375.png"
npx --yes playwright@latest screenshot --viewport-size=375,900 http://127.0.0.1:3010/case-studies/mcpgate-v1-1 "$SCREEN_DIR/mcpgate-375.png"
```

Expected: three PNG files are created.

- [ ] **Step 4: List screenshot evidence**

Run:

```bash
find "$HOME/Documents/copilot-docs/portfolio-critique-screenshots" -maxdepth 1 -type f -name '*.png' | sort
```

Expected: at least 13 screenshot paths are listed.

---

### Task 3: Inspect Source and Content Signals

**Files:**
- Read: `src/app/page.tsx`
- Read: `src/components/Hero.tsx`
- Read: `src/components/Projects.tsx`
- Read: `src/components/About.tsx`
- Read: `src/components/Contact.tsx`
- Read: `src/lib/constants.ts`
- Read: `src/lib/jsonld.ts`
- Read: `src/app/layout.tsx`
- Read: `src/app/blog/page.tsx`
- Read: `src/components/BlogSearch.tsx`
- Read: `src/components/BlogList.tsx`
- Read: `src/app/resume/page.tsx`
- Read: `src/app/now/page.tsx`
- Read: `src/app/case-studies/page.tsx`
- Read: `src/app/case-studies/[slug]/page.tsx`

- [ ] **Step 1: Map page and component structure**

Run:

```bash
sed -n '1,220p' src/app/page.tsx
sed -n '1,180p' src/components/Hero.tsx
sed -n '1,240p' src/components/Projects.tsx
sed -n '1,220p' src/components/About.tsx
sed -n '1,220p' src/components/Contact.tsx
```

Expected: reviewer has current homepage section order, hero copy, project layout, about copy, and contact behavior.

- [ ] **Step 2: Map content source of truth**

Run:

```bash
sed -n '1,260p' src/lib/constants.ts
```

Expected: reviewer can identify current title/status, projects, journey, tech stack, and about-area content.

- [ ] **Step 3: Inspect SEO and metadata signals**

Run:

```bash
sed -n '1,220p' src/app/layout.tsx
sed -n '1,180p' src/lib/jsonld.ts
find src/app -maxdepth 3 \( -name 'opengraph-image.tsx' -o -name 'sitemap.ts' -o -name 'robots.ts' -o -path '*feed.xml*' \) -print
```

Expected: reviewer can cite metadata, structured data, OG, sitemap, robots, and RSS coverage.

- [ ] **Step 4: Inspect discovery and proof paths**

Run:

```bash
sed -n '1,220p' src/app/blog/page.tsx
sed -n '1,220p' src/components/BlogSearch.tsx
sed -n '1,220p' src/components/BlogList.tsx
sed -n '1,240p' src/app/resume/page.tsx
sed -n '1,220p' src/app/now/page.tsx
sed -n '1,220p' src/app/case-studies/page.tsx
sed -n '1,260p' src/app/case-studies/[slug]/page.tsx
```

Expected: reviewer can evaluate whether readers can move from first impression to proof.

- [ ] **Step 5: Search for conversion and accessibility anchors**

Run:

```bash
rg -n "contact|resume|GitHub|LinkedIn|aria-|sr-only|alt=|focus|button|href=" src/app src/components src/lib
```

Expected: reviewer can identify CTA paths, hidden headings, image alt text, buttons, links, and likely keyboard/focus concerns.

---

### Task 4: Score the Site and Draft Findings

**Files:**
- Create outside repo: `~/Documents/copilot-docs/portfolio-website-critique-2026-06-02.md`

- [ ] **Step 1: Create the report skeleton**

Create `~/Documents/copilot-docs/portfolio-website-critique-2026-06-02.md` with this exact structure:

```markdown
# Portfolio Website Critique — 2026-06-02

## Executive Verdict

## Balanced Audience Scorecard

### Recruiters / hiring managers

### Senior engineers

### Microsoft / professional trust

### Blog readers

## What Already Works

## Highest-Impact Fixes

## Page-by-Page Notes

### Homepage

### Projects and Case Studies

### About, Resume, and Now

### Blog and Discovery

### Contact and Conversion

## Accessibility and Responsiveness Notes

## SEO and Shareability Notes

## Visual Evidence

## Recommended Next Implementation Slice
```

Expected: report file exists with no scored rows filled yet.

- [ ] **Step 2: Fill the executive verdict**

Write 2-4 paragraphs answering:

```markdown
The site's strongest current impression is ...

The biggest current risk is ...

The review should preserve ...

The next implementation slice should focus on ...
```

Expected: verdict names both the site strength and the highest-risk weakness.

- [ ] **Step 3: Fill the audience scorecard**

Use this scoring rubric:

```markdown
- 9-10: excellent; only polish remains.
- 7-8: strong; one or two clear gaps.
- 5-6: acceptable; several gaps weaken trust or conversion.
- 3-4: weak; audience likely fails to find what they need.
- 1-2: broken or absent.
```

Expected: each audience has a score, rationale, risk, and recommended improvement.

- [ ] **Step 4: Rank findings**

Use this priority rubric:

```markdown
- P0: Blocks trust or conversion for multiple audiences.
- P1: High impact and low-to-medium effort.
- P2: Useful but not urgent.
- P3: Nice-to-have polish or larger later investment.
```

Expected: at least 6 findings and no more than 12 findings. Each finding includes audience impact, evidence, recommendation, and effort.

- [ ] **Step 5: Identify the next implementation slice**

Write one independently shippable slice with these four completed subsections:

- `Recommended slice:` followed by a concrete slice name.
- `Why this first:` with three evidence-backed reasons from the ranked findings.
- `Included:` with three to five specific changes suitable for one PR.
- `Not included:` with two or more explicitly deferred changes that would expand scope.

Expected: the slice is small enough for one PR and does not require a full redesign.

---

### Task 5: Produce a Visual Companion Summary

**Files:**
- Read outside repo: `~/Documents/copilot-docs/portfolio-website-critique-2026-06-02.md`
- Create visual companion screen using the active brainstorming companion session if available.

- [ ] **Step 1: Decide whether a visual screen is useful**

Use this test:

```text
If the top findings are mainly visual hierarchy, layout, or responsive behavior, create a companion screen.
If the top findings are mostly copy/content/navigation, summarize in terminal only.
```

Expected: reviewer makes an explicit yes/no decision.

- [ ] **Step 2: If useful, create a visual summary screen**

Write a new companion HTML fragment named `critique-summary.html` in the active visual companion `screen_dir`. The screen must summarize the top three findings from the report. Use the exact finding titles and recommendations from the report, and use this HTML structure:

```html
<h2>Portfolio Critique: Highest-Impact Fixes</h2>
<p class="subtitle">Balanced across recruiter clarity, senior-engineer credibility, professional trust, and blog-reader personality.</p>

<div class="options" data-multiselect>
  <div class="option" data-choice="p1" onclick="toggleSelect(this)">
    <div class="letter">1</div>
    <div class="content">
      <h3>Use the report's highest-priority finding title here</h3>
      <p>Use one sentence from the report that combines evidence and recommendation.</p>
    </div>
  </div>
  <div class="option" data-choice="p2" onclick="toggleSelect(this)">
    <div class="letter">2</div>
    <div class="content">
      <h3>Use the report's second-highest-priority finding title here</h3>
      <p>Use one sentence from the report that combines evidence and recommendation.</p>
    </div>
  </div>
  <div class="option" data-choice="p3" onclick="toggleSelect(this)">
    <div class="letter">3</div>
    <div class="content">
      <h3>Use the report's third-highest-priority finding title here</h3>
      <p>Use one sentence from the report that combines evidence and recommendation.</p>
    </div>
  </div>
</div>
```

Expected: user can view and react to the ranked fixes, and the screen contains no template language.

- [ ] **Step 3: Add visual summary notes to the report**

Append to the report:

```markdown
## Visual Companion Summary

Summarize the visual companion screen, the top options shown, and any user selection events if the browser companion recorded them.
```

Expected: report remains useful even if the browser companion is not reopened later.

---

### Task 6: Final Review and Handoff

**Files:**
- Read/write outside repo: `~/Documents/copilot-docs/portfolio-website-critique-2026-06-02.md`

- [ ] **Step 1: Check report completeness**

Run:

```bash
grep -nEi 'TBD|TODO|placeholder|\[Finding title\]|\[One-sentence|\|  \|' "$HOME/Documents/copilot-docs/portfolio-website-critique-2026-06-02.md" || true
```

Expected: no placeholder rows or bracketed placeholders remain.

- [ ] **Step 2: Verify screenshot evidence exists**

Run:

```bash
find "$HOME/Documents/copilot-docs/portfolio-critique-screenshots" -maxdepth 1 -type f -name '*.png' | wc -l
```

Expected: output is `13` or higher.

- [ ] **Step 3: Verify the report has a next slice**

Run:

```bash
grep -n "Recommended slice:" "$HOME/Documents/copilot-docs/portfolio-website-critique-2026-06-02.md"
```

Expected: one recommended slice is present.

- [ ] **Step 4: Stop the local dev server**

Use the shell/session ID from Task 1, Step 3 and stop it with the runtime stop tool, or use a specific PID if the server was detached.

Expected: `curl -I http://127.0.0.1:3010/` no longer returns a successful response after shutdown.

- [ ] **Step 5: Present the critique**

Final response must include:

```markdown
Report saved to: ~/Documents/copilot-docs/portfolio-website-critique-2026-06-02.md

Top 3 findings:
1. ...
2. ...
3. ...

Recommended next slice: ...
```

Expected: user can read the full report and approve the next implementation slice.
