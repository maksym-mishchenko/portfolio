# State — portfolio
Last updated: 2026-06-02 by Copilot

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

## In progress
- Dependency modernization and quality cleanup: update direct dependencies, clear lint warnings,
  validate audit/typecheck/build, and open an issue-linked PR.

## Known issues
- None currently tracked after dependency modernization validation.

## Next steps
- Complete the dependency modernization and quality cleanup PR.
- Decide the next product/content investment after technical quality cleanup is merged.
- Future: swap generated SVG thumbnails for real screenshots if desired.
