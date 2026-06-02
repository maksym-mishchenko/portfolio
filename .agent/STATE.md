# State — portfolio
Last updated: 2026-06-02 by Copilot

## Done
- Phase 1 complete: /resume print-to-PDF, per-post OG images, JSON-LD Person/BlogPosting,
  RSS footer link, /now page, neutral status badge (SITE.status in Hero.tsx). [PR #6 merged]
- Phase 2 — richer project cards: `Project.thumbnail` now rendered as a 16:9 banner at the
  top of each card in `Projects.tsx` (next/image, unoptimized for SVG). On-brand terminal
  SVG thumbnails added for both projects in `public/images/portfolio/`. `learned` line
  already shipped. [feat/project-thumbnails]
- Flagship mcpgate case study shipped at `/case-studies/mcpgate-v1-1`. [PR #8 merged]
- Case-study distribution kit shipped at `/case-studies/mcpgate-v1-1/share`. [PR #9 merged]
- Phase 3 blog search implemented on `issue-13/blog-search`; PR #14 links issue #13 and is ready to merge after CI.

## In progress
- About professional snapshot implemented on `issue-10/about-professional-snapshot`; PR pending/open for `/about`.

## Known issues
- 6 non-failing lint warnings remain in `mdx/interactive/InteractiveFlow.tsx`
  (unused props/setters/import).

## Next steps
- Review and merge the `/about` professional snapshot PR.
- Merge the Phase 3 blog search PR #14 and remove the local worktree after merge.
- Future: swap generated SVG thumbnails for real screenshots if desired.
