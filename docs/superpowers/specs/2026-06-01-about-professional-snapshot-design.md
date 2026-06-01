# About Professional Snapshot Design

## Purpose

Create `/about` as a professional snapshot page for Maksym Mishchenko. The page should help recruiters, referrers, peers, and hiring managers quickly understand what Maksym works on, where his strengths are, and which proof links best support that positioning.

This is not a job-seeking page. The language must preserve the currently-employed framing: Software Engineer II at Microsoft Security, focused on identity, security, developer tooling, and agentic automation.

## Goals

- Give visitors a single, decision-ready professional profile page.
- Reuse existing portfolio content instead of duplicating resume copy.
- Link directly to the strongest proof surfaces: resume, mcpgate case study, mcpgate share summary, GitHub, LinkedIn, and contact.
- Keep the tone neutral, credible, and current.
- Preserve the site's terminal-inspired dark aesthetic and static-first architecture.

## Non-goals

- Do not create a `/hire` page or use "available for hire" language.
- Do not add a light theme, new animation system, or new dependencies.
- Do not invent metrics or claims that are not already supported by the portfolio.
- Do not replace the print-focused `/resume` page.

## Page Positioning

The page should answer three questions:

1. Who is Maksym professionally?
2. What problems does he solve?
3. What evidence proves it?

The top-level framing should be:

> Software Engineer II at Microsoft Security working on identity, application governance, security-focused infrastructure, and AI-agent tooling.

The page should feel useful for internal mobility, referrals, conference networking, and future opportunities without implying an active job search.

## Information Architecture

### 1. Hero snapshot

Show:

- Name and current status from `SITE`.
- A concise positioning sentence.
- Primary links to `/resume`, LinkedIn, GitHub, and email.
- Optional link to `/now` for current focus.

### 2. What I work on

Show three concise focus cards:

- Identity and security systems.
- Developer tooling and CI/CD automation.
- Agentic AI, MCP, and personal automation.

These can live in a small `ABOUT` constant if the copy is unique to this page.

### 3. Proof of work

Highlight the best evidence:

- `mcpgate` as the flagship technical proof.
- `/case-studies/mcpgate-v1-1` for deep technical context.
- `/case-studies/mcpgate-v1-1/share` for a share-ready summary.
- Selected `PROJECTS` entries for breadth.

### 4. Timeline at a glance

Render a condensed career timeline from `JOURNEY`. Exclude entries with `resumeHide` where they would make the professional snapshot noisy.

### 5. Current focus

Render a short current-focus section from `NOW` so the page stays aligned with the rest of the site.

## Data Model

Use existing source-of-truth constants where possible:

- `SITE` for identity, role, contact, and profile links.
- `PROJECTS` for selected projects and proof links.
- `JOURNEY` for the career timeline.
- `TECH_STACK` if a compact skills surface is needed.
- `NOW` for current focus.

Add an `ABOUT` constant only for page-specific copy that does not belong in existing structures.

## Architecture

- Add a static App Router page at `src/app/about/page.tsx`.
- Keep it server-rendered; no client component is required.
- Use existing Tailwind tokens and layout patterns from `/resume`, `/now`, and case-study pages.
- Add page metadata with a concise title and description.
- Reuse existing JSON-LD helpers for Person schema if appropriate.
- Add `/about` to sitemap and navigation/footer only if it fits the existing patterns cleanly.

## Content Guidelines

- Use neutral professional language.
- Mention Microsoft Security and current focus clearly.
- Avoid "hire me", "open to work", "available", salary, or job-search framing.
- Avoid unsupported numeric claims.
- Prefer evidence links over self-promotion.

## Error Handling

The page should not depend on external fetches or runtime-only data. All content is static and local. If a project lacks a link, render only the available actions rather than inventing fallbacks.

## Accessibility

- Use semantic sections and headings.
- Keep links descriptive.
- Preserve visible focus styles from existing design tokens.
- Do not rely on icons alone for meaning.

## Validation

Run the standard repository checks after implementation:

- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

## Success Criteria

- `/about` builds as a static route.
- The page reads as a professional snapshot, not a job-seeking page.
- The strongest proof surfaces are reachable within one click.
- The implementation reuses source-of-truth constants and avoids duplicate resume copy.
- No new dependencies are introduced.
