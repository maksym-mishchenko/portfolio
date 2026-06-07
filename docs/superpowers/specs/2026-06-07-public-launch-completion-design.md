# Public Launch Completion Design

## Goal

Define the final one-week launch-hardening sprint needed to call `mmishchenko.dev` public-launch complete: polished enough to share widely on LinkedIn, GitHub, referrals, and direct recruiter conversations without obvious unfinished surfaces.

## Completion Definition

The portfolio is public-launch complete when a first-time visitor can:

- Understand who Maksym is within 5 seconds.
- Find credible proof of seniority and security/backend focus without hunting.
- Share the site confidently through social links, referrals, and chat previews.
- Browse homepage, resume, blog, case studies, About, and Now without seeing thin or placeholder-feeling surfaces.
- Use contact/discovery paths without broken metadata, feeds, navigation, or build quality issues.

This is not a full product roadmap. It is a finish-line sprint to remove the remaining signs that the site is still in progress.

## Current Context

Already shipped or in progress:

- Phase 1 SEO/discoverability bundle: `/resume`, per-post OG images, JSON-LD, RSS, `/now`, status badge.
- Phase 2 project cards and flagship `mcpgate` case study.
- Phase 3 blog search, tags, RSS, sticky navigation, and social footer.
- Professional `/about` page with focus-area proof and proof links.
- Homepage credibility lift branch: visible identity, immediate CTAs, Resume CTA, and homepage proof cards.
- Dependency/security cleanup including patched PostCSS override and passing moderate audit baseline.

Known remaining completion risks:

- Some surfaces can still feel thin, especially resume experience proof and the case-studies index.
- Blog discovery exists, but first-time readers need a clearer "start here" path and cohesive styling.
- `/now` freshness should be intentional rather than implied by dynamic dates.
- Metadata and previews should be verified across shareable pages.
- The homepage credibility lift must be merged, deployed, and visually verified live.

## Completion Pillars

### 1. First-Impression Polish

The live homepage must immediately show identity, positioning, and primary CTAs without waiting for animation. The terminal aesthetic remains as personality, not the only orientation mechanism.

Required outcomes:

- Homepage credibility lift merged and deployed.
- Hero includes visible name, security-minded positioning line, Resume CTA, Projects, Blog, and GitHub.
- Homepage About section surfaces compact proof cards from the existing About content.
- Desktop and mobile screenshots confirm the first frame looks intentional.

### 2. Proof Depth

The site should prove competence through concise evidence, not just role labels.

Required outcomes:

- Resume professional entries include short achievement bullets where truthful detail is already known.
- Project/case-study paths make `mcpgate` the clear flagship proof point.
- Case-studies index avoids promising a broad library when only one flagship case study exists.
- No invented metrics or exaggerated claims are added.

### 3. Discovery Polish

Blog, RSS, and share surfaces should feel cohesive and guide first-time readers.

Required outcomes:

- Blog search/list styling aligns with site tokens and the dark terminal/security aesthetic.
- Blog page includes a clear "start here" or featured-reader path.
- RSS remains discoverable.
- `/now` uses a static, intentional `lastUpdated` value.

### 4. Operational Finish

The repo and live site should be safe to leave alone after launch.

Required outcomes:

- Metadata and social previews are verified for homepage, About, Resume, Blog, flagship case study, and share page.
- Contact, navigation, RSS, sitemap, and robots smoke checks pass.
- `npm run lint`, `npx tsc --noEmit`, `npm run build`, and `npm audit --audit-level=moderate` pass.
- CHANGELOG, `.agent/STATE.md`, version tag/release notes, and PR are complete.

## One-Week Sprint Scope

### Included

1. Merge/deploy the homepage credibility lift and verify it on the live site.
2. Add concise resume achievement bullets using known truthful work only.
3. Reframe the case-studies index around `mcpgate` as the current flagship.
4. Align blog search/list styling and add a first-time-reader path.
5. Make `/now` freshness explicit with a static last-updated field.
6. Enrich or verify site metadata and share previews.
7. Run final launch QA and document the release.

### Out of Scope

- Light mode.
- New backend, CMS, database, or analytics platform.
- Full visual redesign.
- More than one new long-form case study.
- Invented metrics, claims, or achievements.

## Execution Sequence

1. **Ship current branch first.** Review, merge, deploy, and verify the homepage credibility lift so the biggest first-impression fix is no longer floating.
2. **Content/proof pass.** Strengthen resume proof and case-study framing.
3. **Discovery/cohesion pass.** Polish blog styling, reader path, `/now` freshness, and metadata.
4. **Launch QA pass.** Run automated checks, smoke checks, screenshots, changelog/state updates, release notes, and tag.

This order keeps every slice independently shippable and prevents final QA from being mixed with content changes.

## Acceptance Criteria

The portfolio can be called public-launch complete when all criteria below are true:

- Live homepage has immediate visible identity, Resume CTA, and proof cards.
- Resume includes credible achievement bullets for relevant roles/projects without invented metrics.
- Case-studies index clearly presents `mcpgate` as the current flagship and does not feel like an empty library.
- Blog has cohesive styling and a first-time-reader path.
- `/now` shows an intentional static last-updated date.
- Person/site metadata and social previews are verified for homepage, About, Resume, Blog, flagship case study, and share page.
- Contact, RSS, sitemap, robots, and main navigation pass smoke checks.
- `npm run lint`, `npx tsc --noEmit`, `npm run build`, and `npm audit --audit-level=moderate` pass.
- Final screenshots are captured for key pages on mobile and desktop.
- CHANGELOG, `.agent/STATE.md`, version tag/release notes, and PR are complete.

## Success Metric

The sprint succeeds if the site feels finished rather than merely feature-rich: a visitor should see clear identity, strong proof, cohesive discovery paths, and no obvious "still under construction" surfaces in the first 5 minutes of browsing.
