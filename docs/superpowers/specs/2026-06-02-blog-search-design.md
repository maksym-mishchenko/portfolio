# Blog Search Design

## Summary

Add client-side search to `/blog` so readers, recruiters, and referrers can quickly find posts by title, description, or tag. The feature should preserve the current server-rendered blog data flow and visual style while adding a small progressive enhancement above the existing post list.

## Goals

- Help visitors find relevant proof points faster without browsing the full archive.
- Keep `/blog` simple, fast, and dependency-free.
- Reuse existing MDX frontmatter and `getAllPosts()` metadata.
- Preserve the current blog card layout and page aesthetic.

## Non-goals

- No fuzzy search library or ranking engine.
- No backend search route, database, or indexing service.
- No separate `/blog/search` page.
- No redesign of blog cards or the overall blog page layout.

## Architecture

`src/app/blog/page.tsx` remains the server component responsible for loading posts with `getAllPosts()`. It passes a lightweight array of serializable post metadata into a new client component, likely `BlogSearch`.

The client component owns only interactive UI state:

- Search query text.
- Filtered post results.
- Result count and empty-state display.

The client component must not import filesystem, MDX, or server-only blog-loading utilities. Its input contract should be explicit and narrow: title, description, slug, date, tags, and any already-rendered display fields needed by the existing card UI.

## Search behavior

Search should be case-insensitive, whitespace-trimmed, and deterministic. A post matches when the normalized query appears in any of these fields:

- Title.
- Description.
- Tags.
- Optional display metadata that already exists on the card, such as formatted date or reading time.

An empty query shows all posts in the same order as the current `/blog` page. Posts without tags should still render and match by title or description.

## UX

Add a compact search module above the post list:

- Input placeholder: `Search posts by title, topic, or tag...`.
- Small result count: `N posts` when empty, `N matches` when filtering.
- Zero-match state with a short message and a `Clear search` action.

Result cards should use the same markup and styling as the current blog list to avoid a parallel design system. Tags are searchable through the text input; clickable tag filters are intentionally deferred unless the tag set later becomes large enough to justify a separate interaction.

## Error handling and edge cases

- Empty or whitespace-only query: show all posts.
- Mixed case query: match case-insensitively.
- Posts with missing optional fields: treat missing strings or tag arrays as empty values.
- Zero matches: show a helpful empty state instead of a blank page.
- Server/client boundary: keep post loading on the server and pass only serializable metadata to the client component.

## Testing and verification

Use the existing project checks:

- `npm run lint -- --quiet`
- `npx tsc --noEmit`
- `npm run build`

If the repository already has React component tests by implementation time, add focused coverage for the pure filtering behavior and empty-state rendering. If not, keep the filter logic small and typed so TypeScript and build verification cover the contract.

## Implementation notes

- Prefer a focused client component under `src/components/` or a blog-specific component folder if one already exists.
- Extract a small pure helper for normalization/filtering only if it improves readability or testability.
- Do not add dependencies.
- Keep copy neutral and useful; avoid job-search language.
