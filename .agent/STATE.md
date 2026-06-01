# State — portfolio
Last updated: 2026-06-01 by maksym

## Done
- Phase 1 complete: /resume print-to-PDF, per-post OG images, JSON-LD Person/BlogPosting,
  RSS footer link, /now page, neutral status badge (SITE.status in Hero.tsx). [PR #6 merged]
- Phase 2 — richer project cards: `Project.thumbnail` now rendered as a 16:9 banner at the
  top of each card in `Projects.tsx` (next/image, unoptimized for SVG). On-brand terminal
  SVG thumbnails added for both projects in `public/images/portfolio/`. `learned` line
  already shipped. [feat/project-thumbnails]

## In progress
- PR (feat/project-thumbnails) — project card thumbnails.
- Case-study implementation planned and ready for PR execution; first flagship is mcpgate v1.1.0.

## Known issues
- 6 non-failing lint warnings remain in `mdx/interactive/InteractiveFlow.tsx`
  (unused props/setters/import).

## Next steps
- Phase 3: client-side blog search over title/description/tags. (/now already exists.)
- Future: swap generated SVG thumbnails for real screenshots if desired.
