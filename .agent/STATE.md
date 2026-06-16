# State — portfolio
Last updated: 2026-06-16 by Copilot

## Done
- Phase 1 complete: /resume print-to-PDF, per-post OG images, JSON-LD Person/BlogPosting,
  RSS footer link, /now page, neutral status badge (SITE.status in Hero.tsx). [PR #6 merged]
- Phase 2 complete: richer project cards with `Project.thumbnail`, terminal SVG thumbnails,
  and `learned` lines. [PR #7 merged]
- Flagship mcpgate case study shipped at `/case-studies/mcpgate-v1-1`. [PR #8 merged]
- Case-study distribution kit shipped at `/case-studies/mcpgate-v1-1/share`. [PR #9 merged]
- About professional snapshot shipped at `/about`. [PR #11 merged]
- Phase 3 blog search shipped: `/blog` remains server-rendered and delegates client-side
  filtering to `BlogSearch`. Search covers title, description, date, reading time, and tags. [PR #14 merged]
- Maintenance readiness sweep complete: preserved local planning commits, aligned local `main`
  with `origin/main`, refreshed agent state, and updated changelog hygiene. [PR #16 merged]
- Dependency modernization and quality cleanup complete: updated direct dependencies, cleared lint warnings, validated typecheck/build, and documented deferred upstream audit/tooling follow-ups. [issue #17]
- Dependency audit follow-up complete: forced PostCSS 8.5.15 via npm overrides so Next.js uses the patched transitive version and `npm audit --audit-level=moderate` passes. [issue #18]
- Public-launch completion sprint complete: homepage credibility lift deployed, resume proof bullets, flagship case-study framing, blog discovery polish, static /now freshness, richer metadata, launch smoke checks, and v0.2.0 release prep. [issue #25]
- App review fixes complete: hardened production CSP by removing `unsafe-eval`, noindexed URL-live drafts, validated blog publish payloads, made contact delivery fail closed when email is not configured, and added safe JSON parsing for interactive MDX props.
- Resume impact bullets refreshed for Stora Enso, EPAM Systems, and Microsoft Security with stronger action/result language that avoids invented metrics. [issue #29]
- Stora Enso resume bullets updated with concrete CI/CD Selenium gate, invoice-processing expansion, PM coordination, deployment/testing/on-call ownership, WebSphere MQ, and test-coverage details.
- EPAM resume bullets updated with investing-platform DevEx, licensing validation libraries, package management, 70% ticket handoff reduction, developer support, feedback gathering, and license-accountability work.
- Resume experience now renders newest-first, with Microsoft Security labeled `2025–Now` before EPAM Systems and Stora Enso.
- Resume PDF action now triggers browser print/save before non-critical analytics, so blocked analytics cannot break the button.
- UX polish pass complete: contrast, no-JS homepage resilience, contact form announcements, nav semantics/touch targets, canonical metadata, resume date ranges, direct PDF, favicon fallback, and duplicate blog-list cleanup.
- Final recruiter-readiness polish complete: warmer homepage positioning, more scannable long-form article/case-study pages, stronger case-study outcome callouts, and more comfortable mobile resume spacing.
- Cloudflare deployment readiness configured for the full-stack Next.js app via OpenNext on Workers, including Wrangler config, deploy workflow, static asset headers, and setup docs.
- Staging publish and contact JSON response handling now use explicit guards so strict typecheck passes reliably.
- Cloudflare Worker size fix complete: dynamic `next/og` routes removed, Mermaid runtime replaced with a source fallback, and deploy workflow guarded by `wrangler deploy --dry-run` before the real deploy.

## In progress
- None.

## Known issues
- ESLint 10 remains deferred until eslint-config-next and its bundled React/import/a11y plugins support it. [follow-up #20]

## Next steps
- Track ESLint 10 compatibility in #20.
- Decide the next product/content investment after technical quality cleanup is merged.
- Future: swap generated SVG thumbnails for real screenshots if desired.
