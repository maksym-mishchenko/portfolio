# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

**Agent contribution policy:** Every agent-authored PR must append an entry to `[Unreleased]` with a one-line summary. Include task ID if available.

---

## [Unreleased]

### Added
- Cloudflare Workers deployment readiness via OpenNext, Wrangler JSONC config, Worker deploy workflow, and documented Cloudflare setup requirements.

### Changed
- Tightened staging publish and contact response parsing so strict typecheck stays green during deployment validation.
- Reduced the Cloudflare Worker bundle below the free-plan upload limit by removing dynamic `next/og` routes, replacing Mermaid rendering with a lightweight fallback, and adding a Wrangler dry-run deploy guard.

### Fixed
- Fixed broken Cloudflare Worker case-study links by serving the flagship mcpgate case study from concrete static routes with bundled runtime content.
- Fixed structured-data image URLs that still pointed at removed OpenGraph image routes.

## [0.2.0] - 2026-06-07

### Added
- Public-launch hardening sprint: resume proof bullets, flagship case-study framing, blog discovery polish, intentional `/now` freshness, enriched metadata, and launch smoke checks.
- Phase 1 portfolio SEO/discoverability bundle: `/resume`, per-post OG images, JSON-LD Person/BlogPosting, RSS footer link, `/now`, and neutral Microsoft Security status badge (PR #6)
- Richer project cards with terminal-style thumbnails and learned lines (PR #7)
- Flagship mcpgate case study at `/case-studies/mcpgate-v1-1` (PR #8)
- Case-study distribution kit at `/case-studies/mcpgate-v1-1/share` (PR #9)
- About professional snapshot page at `/about` (PR #11)
- Client-side blog search for title, description, date, reading time, and tags while preserving server-rendered `/blog` (PR #14)
- Maintenance readiness sweep spec and implementation plan
- Agent security blog post: "What Microsoft Shipped" (2026-05-27)
- Agent security carousel PDF attachment
- `published` flag for staged posts — hidden from index, `noindex` meta, staging banner
- Sticky nav, back-to-top button, social footer
- Blog tag filter and RSS link
- Reduced-motion CSS fixes (PR #5)

### Changed
- Blog post titles capitalized on render
- Removed private OpenClaw Dashboard reference from published blog post
- Refreshed agent-facing project state after blog search merge
- Modernized direct dependencies and cleared known lint warnings.
- Added a PostCSS npm override so dependency audit passes while Next.js upstream catches up.
- Replaced the duplicated hero terminal title line with focused security/automation copy.
- Lifted homepage credibility by making hero identity/CTAs immediate and surfacing About proof cards.
