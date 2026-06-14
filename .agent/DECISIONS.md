# Decisions — portfolio

<!-- Tag vocabulary (controlled, edit per repo): #api #ui #data #auth #infra #build -->

<!-- Newest entries on top. Template:

## [YYYY-MM-DD] <short title>  #tag
**What:** <what changed>
**Why:** <reasoning / problem solved>
**Rejected:** <alternatives and why not> (optional)

-->
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
