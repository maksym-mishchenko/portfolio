# Decisions — portfolio

<!-- Tag vocabulary (controlled, edit per repo): #api #ui #data #auth #infra #build -->

<!-- Newest entries on top. Template:

## [YYYY-MM-DD] <short title>  #tag
**What:** <what changed>
**Why:** <reasoning / problem solved>
**Rejected:** <alternatives and why not> (optional)

-->
## [2026-06-19] Generated blog bundle for Cloudflare Workers  #infra
**What:** Added a generated `src/lib/blog.generated.ts` bundle from `content/blog/*.mdx` and made the blog loader fall back to it when runtime filesystem content is unavailable.
**Why:** Cloudflare Workers can render the blog index without access to the repository `content/blog` directory; the fallback preserves URL-live posts, RSS, sitemap, and static params.
**Rejected:** Hand-maintaining post data in source, because it would drift from MDX content; relying only on runtime `fs`, because production rendered 0 posts.

## [2026-06-17] Keep ESLint 9 baseline until Next lint stack supports ESLint 10  #build
**What:** Recorded issue #20 as still blocked after re-testing with `eslint@10.5.0` and `eslint-config-next@16.2.9`; keep the current ESLint 9 baseline and re-test when upstream plugin support lands.
**Why:** The bundled `eslint-plugin-react@7.37.5` in `eslint-config-next` still fails (`contextOrFilename.getFilename is not a function`) and only declares peer support through ESLint `^9.7`.
**Rejected:** Forcing an ESLint 10 upgrade now, because `npm run lint` hard-fails before project rules execute.

## [2026-06-16] Concrete case-study routes for Cloudflare Workers  #infra
**What:** Replaced generic case-study detail routes with concrete `/case-studies/mcpgate-v1-1` and `/case-studies/mcpgate-v1-1/share` routes, added bundled runtime fallback data, and rendered the flagship case-study body without route-time MDX evaluation.
**Why:** OpenNext generated the pages during `next build`, but the Cloudflare Worker returned 404/500 because runtime route handling could not rely on filesystem-backed MDX content and MDX evaluation in the Worker.
**Rejected:** Keeping only `[slug]` routes, because Worker preview reproduced the production 404; keeping `MDXRemote` on the detail route, because Worker preview reproduced a 500 after data was bundled.

## [2026-06-16] Cloudflare Worker free-plan size guard  #infra
**What:** Removed dynamic `next/og` special routes, switched Mermaid MDX rendering to a lightweight source fallback, and added a Wrangler dry-run upload-size guard before Cloudflare deploy.
**Why:** The merged Workers deployment failed with Cloudflare error `10027` because the OpenNext Worker exceeded the free-plan 3 MiB gzip limit. The guard makes size regressions fail before the real deploy request.
**Rejected:** Static Pages export, because it would drop the current API routes and full-stack Next.js behavior; claiming Workers production readiness without a size guard, because main had already failed at deploy time.

## [2026-06-16] Cloudflare Workers target for Next.js deployment  #infra
**What:** Added OpenNext Cloudflare adapter configuration and Wrangler JSONC for a Cloudflare Workers deployment target.
**Why:** The portfolio has App Router route handlers, runtime secrets, and `next/image`, so static Cloudflare Pages would not preserve existing full-stack behavior.
**Rejected:** Static Pages export, because it would drop API routes and server runtime behavior.

## [2026-06-14] App review hardening  #api
**What:** Blog publish now validates payloads with Zod and serializes frontmatter with `gray-matter`; contact form returns 503 when email delivery is not configured and avoids logging submitted PII; URL-live drafts now emit noindex metadata.
**Why:** Public endpoints and staged content should fail explicitly, preserve valid content shape, and avoid accidental indexing or silent message loss.
**Rejected:** Keeping development-style permissive fallbacks that report success without durable delivery.

## [2026-06-14] Safe MDX interactive props  #ui
**What:** Interactive MDX components now parse JSON props through shared typed guards and render author-facing configuration errors instead of throwing during render.
**Why:** A malformed MDX prop should not crash a blog or case-study page.

## [2026-05-29] Two-column resume with scoped print CSS  #ui
**What:** Redesigned the resume into a left sidebar (skills/certs/education) + right timeline, with @media print rules scoped to a `.resume-doc` wrapper via `:has()` so dark-mode isn't stripped from other pages (8ce80f3).
**Why:** Print-to-PDF must use light colors; scoping the print CSS prevents it bleeding into and breaking other pages' dark theme.
**Rejected:** Global print styles (broke other pages).

## [2026-05-27] Published flag for staged blog posts  #data
**What:** Added a `published: boolean` frontmatter field plus noindex meta and a staging banner; staged posts are URL-live but hidden from index, RSS, and sitemap (3dd18e8).
**Why:** Enables a draft-to-publish workflow where posts can be shared for review before public listing.
**Rejected:** A traditional draft flag that hides the URL entirely.

## [2026-05-27] Sticky nav + accessibility infrastructure  #ui
**What:** Added a StickyNav floating pill (appears at 400px), BackToTop (600px), prefers-reduced-motion support, blog tag filtering, and section IDs for scroll-safe nav (45b39a0).
**Why:** Improves navigation and accessibility without breaking the home hero design, and respects user motion preferences.

## [2026-05-26] Interactive diagrams via React Flow + Mermaid  #ui
**What:** Added `<InteractiveFlow>` (drag/zoom, animated edges, dark mode, minimap) and `<Mermaid>` components, replacing static blog flow diagrams (1139d8d).
**Why:** Lets readers explore complex architectures interactively client-side instead of viewing static images.

## [2026-05-12] Single-quoted MDX attrs for JSON props  #data
**What:** Changed interactive MDX components' JSON payloads to plain single-quoted string literals instead of JSON.stringify(), required by next-mdx-remote RSC (a6f28e3).
**Why:** MDXRemote RSC can't serialize functions/objects across the SSR boundary; string literals avoid SSR JSON.parse crashes on interactive components.
**Rejected:** Passing objects directly to MDX props.

## [2026-05-05] Satori + Sharp for dynamic OG/diagram images  #ui
**What:** Replaced hand-crafted SVG diagrams with programmatic Satori PNG generation (2x retina, branded footer, 3 templates) (58b13ed).
**Why:** Static SVGs rendered poorly on mobile; rendering React components to images allows templating and consistent output.
**Rejected:** Hand-crafting an SVG per post.

## [2026-05-04] Interactive MDX components for the blog  #ui
**What:** Added reusable `<Quiz>`, `<CompareTable>`, and `<Timeline>` MDX components in src/components/mdx/ exported for next-mdx-remote/rsc (2ce8836).
**Why:** Enables rich interactivity beyond static prose in blog posts.

## [2026-05-03] Initial stack — Next.js 16 App Router + TypeScript  #build
**What:** Bootstrapped the site on Next.js 16 (App Router, Turbopack), TypeScript strict, Framer Motion, security headers (CSP/HSTS), Zod-validated rate-limited contact form, with file-based MDX content in /content/blog (07fed7e).
**Why:** App Router + strict TypeScript matches the team's conventions and agent tooling; file-based MDX avoids running a CMS/backend.
**Rejected:** A traditional CMS or external backend.
