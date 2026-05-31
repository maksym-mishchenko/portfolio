# State — portfolio
Last updated: 2026-06-01 by maksym

## Done
- Phase 1 backlog largely shipped (fleet): `/resume` print-to-PDF, per-post OG images
  (`blog/[slug]/opengraph-image.tsx`), JSON-LD `Person`/`BlogPosting` (`lib/jsonld.ts`),
  RSS footer link, `/now` page.
- Neutral status badge: `SITE.status` now rendered as a pill in `Hero.tsx` (PR #6).
- Cleared blocking lint errors that pre-existed on main (ResumeActions `<Link>`,
  InteractiveFlow `JSON.parse` typing) — CI lint gate green again.

## In progress
- PR #6 `feat/status-badge` open — status badge + lint fixes.

## Known issues
- 6 non-failing lint warnings remain in `mdx/interactive/InteractiveFlow.tsx`
  (unused `minimap`/`controls` props, `setNodes`/`setEdges`, `useCallback`).

## Next steps
- Phase 2: richer project cards — `Project.thumbnail` exists in the interface but is not
  rendered in `Projects.tsx` (only `learned` is). Wire thumbnails or drop the field.
- Phase 3: client-side blog search over title/description/tags.
