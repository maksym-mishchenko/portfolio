# Case Studies Design

**Date:** 2026-06-01
**Status:** Proposed
**Project:** portfolio (`maksym-mishchenko/portfolio`)

## Goal

Add a case-study layer to the portfolio that turns shipped engineering work into clear hiring signal. The first flagship case study should be **mcpgate v1.1.0: securing AI agent tool calls**.

The case study should lead with the senior-engineering signal: identifying and reducing AI-agent tool-call risk before it becomes production damage. The first screen should make this clear in hiring-manager language: I found a real agent security risk, designed policy and audit controls, shipped the mitigation, and verified the result. Technical proof should appear immediately underneath for senior engineers and security reviewers.

## Problem

The portfolio now has strong surfaces: homepage, projects, blog, `/resume`, `/now`, RSS, per-post OG images, and structured data. The missing career-conversion piece is a deeper narrative that shows how Maksym thinks through constraints, security tradeoffs, review loops, and production release decisions.

Project cards prove that work exists. Case studies should prove senior engineering judgment.

## Success Criteria

- A recruiter or engineering manager can understand the flagship project and its risk-reduction value in 3-5 minutes.
- The first screen is readable by non-specialists, with deeper technical evidence available one scroll below.
- The case study explains the problem, threat model, architecture, tradeoffs, validation, release outcome, and follow-up opportunities.
- The homepage and project cards guide visitors to the case study without adding clutter.
- The implementation follows existing Next.js App Router, MDX, and metadata patterns.
- The feature ships without new runtime dependencies.

## Recommended Scope

Build the first iteration around one polished case study:

1. **Case-study index:** `/case-studies`
2. **Case-study detail route:** `/case-studies/mcpgate-v1-1`
3. **Homepage/project promotion:** link the mcpgate project card to the case study.
4. **Content model:** title, slug, summary, project, date, tags, hero metadata, outcome bullets, and MDX body.
5. **SEO:** page metadata and JSON-LD `Article` or `TechArticle` schema for the detail page.

Do not build a CMS, search, filters, pagination, or multiple new case studies in the first pass.

## Content Architecture

Use MDX because the blog already uses MDX and the case study needs prose plus structured sections. Store files under:

```text
content/case-studies/
  mcpgate-v1-1.mdx
```

Frontmatter should be intentionally small:

```yaml
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
  - "Shipped heuristics-based reverse-channel gating"
  - "Blocked inbound warning content before it reached the agent"
  - "Caught and fixed an error-channel injection bypass before release"
```

The MDX body should follow this narrative:

1. Executive summary: the risk found, the mitigation shipped, and the outcome verified.
2. Context: why MCP tool calls need a gateway.
3. Threat model: prompt injection and tool poisoning through tool results.
4. Constraints: no LLM dependency, local-first CLI, deterministic behavior, fail-closed security posture.
5. Architecture: proxy path, outbound policy checks, inbound result scanning, block-on-warn behavior.
6. Review finding: `resp.Result` was scanned but `resp.Error` was initially missed.
7. Fix: scan both result and error channels; add regression coverage.
8. Release: tag moved to include the fix; GitHub Release cut.
9. What this demonstrates: security mindset, test discipline, and practical product judgment.
10. Next steps: stronger policy config, fuzz cases, and additional transport coverage.

## UI Design

Keep the terminal aesthetic. Avoid a new visual system.

### `/case-studies`

The index should be a simple list of case-study cards:

- eyebrow: `CASE STUDY`
- title
- summary
- tags
- outcome count or one highlighted outcome
- CTA: `Read case study ->`

### `/case-studies/[slug]`

The detail page should prioritize readability:

- headline and summary
- metadata row: project, date, tags
- compact outcome panel focused on risk found, control shipped, and result verified
- MDX article body
- closing CTA back to projects or resume

Use existing layout width and typography patterns from blog posts where possible.

## Data Flow

Create a small case-study loader parallel to the blog loader:

```text
content/case-studies/*.mdx
  -> frontmatter parser
  -> typed CaseStudy object
  -> index route + slug route + metadata generation
```

The case-study project card link should be data-driven, not hardcoded in the component. Extend the existing `Project` interface with an optional `caseStudySlug` or `caseStudyUrl` field.

## SEO and Sharing

Add metadata for:

- `/case-studies`
- `/case-studies/mcpgate-v1-1`

The detail page should include JSON-LD using `TechArticle` if practical, otherwise `Article`. Required fields:

- headline
- description
- datePublished
- author
- keywords
- mainEntityOfPage

Per-case-study OG images are optional for v1. The existing global OG card is acceptable for the first pass.

## Error Handling

- Unknown slug should return `notFound()`.
- Invalid or missing frontmatter should fail during build rather than silently rendering incomplete content.
- Case-study sorting should be deterministic by date descending.

## Testing and Validation

Run existing gates:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Manual checks:

- `/case-studies` renders the mcpgate card.
- `/case-studies/mcpgate-v1-1` renders the full MDX body.
- The mcpgate project card links to the case study.
- Page metadata and JSON-LD are present.
- Existing blog and project pages still render.

## Non-Goals

- No dark/light theme.
- No CMS.
- No filters or search for case studies.
- No multiple case studies in the first implementation.
- No new analytics dependency.
- No new PDF or image-generation dependency.

## Open Decisions Resolved

- **First project:** mcpgate v1.1.0, because it has the strongest security and senior-engineering narrative.
- **Storage:** MDX under `content/case-studies/`, matching existing content conventions.
- **Scope:** one polished case study before expanding to OpenClaw or portfolio self-case-study.
