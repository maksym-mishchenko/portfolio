# State — portfolio
Last updated: 2026-07-30 by copilot-cli (refresh freshness date for PR #67)

## Done
- Broken case-study links fixed for Cloudflare Workers by routing the flagship case-study pages through concrete static routes, bundling the mcpgate case-study fallback data for Worker runtime, and replacing route-time MDX rendering with a lightweight Markdown renderer for the case-study detail page.
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
- CI baseline hardening complete: normalized required checks for `lint`, `typecheck`, `build`, and narrow diff-secret `security`; Dependabot GitHub Actions updates added; `main` branch protection now requires those proven contexts; negative PR #51 proved required `build` failure blocks merge.
- Blog index fixed for Cloudflare Workers by generating a checked-in blog MDX bundle, falling back to it when runtime filesystem content is unavailable, and wiring bundle generation into build/deploy scripts.
- Resume action buttons moved into the resume header below contact links, with top spacing added so the fixed site nav no longer overlaps the PDF/print controls.
- Blog post pages fixed for Cloudflare Workers by replacing runtime `next-mdx-remote/rsc` rendering with a Worker-safe Markdown/MDX-subset renderer that preserves supported interactive components.
- Spec Kit initialized for the repository with Copilot integration, shell scripts, bundled templates, workflow metadata, and agent-context wiring.
- Bumped `actions/setup-node` from 6.5.0 to 7.0.0 in CI and Cloudflare deploy workflows. [PR #67]

## In progress
- None.

## Known issues
- ESLint 10 remains blocked (re-tested 2026-06-15 on `eslint@10.5.0` + `eslint-config-next@16.2.9`): `npm run lint` fatals in bundled `eslint-plugin-react@7.37.5` (`react/display-name` / `contextOrFilename.getFilename is not a function`), and upstream peer support still caps at ESLint `^9.7`. [follow-up #20]

## Next steps
- Re-test issue #20 around 2026-07-07 (or earlier if `eslint-plugin-react` releases ESLint 10 peer support and `eslint-config-next` bundles it).
- Upgrade ESLint only after `npm run lint`, `npx tsc --noEmit`, and `npm run build` pass cleanly without peer dependency override warnings.
- Decide the next product/content investment after technical quality cleanup is merged.
- Future: swap generated SVG thumbnails for real screenshots if desired.
