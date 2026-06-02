# Personal Website Critique Design

## Goal

Review `mmishchenko.dev` as a personal brand and career credibility site, then produce a prioritized critique that is useful for deciding what to improve next.

The review must balance four audiences:

- Hiring managers and recruiters who need a fast signal of role, fit, and contact path.
- Senior engineers who judge technical credibility, project depth, and signal-to-noise ratio.
- Microsoft/internal professional readers who expect polished, trustworthy presentation.
- General readers who arrive through the blog and need personality, orientation, and useful content paths.

## Scope

### In scope

- Homepage hero, CTAs, projects, journey, tech stack, about snapshot, and contact flow.
- Project cards, case-study pathways, resume/now/about/blog navigation, and footer/discoverability.
- Responsive behavior at mobile, tablet, desktop, and wide desktop widths.
- Visual hierarchy, copy clarity, credibility signals, interaction polish, accessibility, SEO/discoverability, and conversion paths.
- Source-level inspection where it explains a visible issue or likely maintainability risk.

### Out of scope

- Implementing code changes during the critique.
- Full light-mode redesign.
- Rewriting all content or creating new blog posts.
- Rebranding away from the existing dark terminal aesthetic.

## Review Method

Use a balanced scorecard with evidence-backed findings. Each finding should include:

- Audience impact: recruiter, senior engineer, professional trust, or blog reader.
- Severity: high, medium, or low.
- Evidence: screenshot observation, source inspection, navigation flow, accessibility concern, or content gap.
- Recommendation: concrete next action, not vague feedback.
- Effort: quick win, small improvement, or larger design/content project.

## Scorecard Categories

1. **Positioning clarity** — whether the first screen quickly explains who Maksym is, what he does, and why the reader should continue.
2. **Credibility depth** — whether projects, case studies, resume, and technical writing prove seniority rather than merely claiming it.
3. **Visual craft** — whether spacing, typography, contrast, animation, and interaction details feel intentional and consistent.
4. **Navigation and conversion** — whether readers can quickly reach projects, blog, GitHub, resume, contact, and strongest proof points.
5. **Content strategy** — whether the site has a coherent narrative across homepage, about, projects, case studies, and blog.
6. **Accessibility and responsiveness** — whether the design holds up across key viewport sizes and basic keyboard/contrast expectations.
7. **SEO and shareability** — whether metadata, structured data, RSS, OG images, and content paths support discovery.

## Evidence Plan

- Run the site locally or inspect the deployed preview if available.
- Capture or inspect representative viewports: 375px, 768px, 1280px, and 1920px.
- Review the homepage, `/about`, `/resume`, `/now`, `/blog`, at least one blog post, `/case-studies`, and the flagship case study.
- Use the visual companion when comparing visual directions or showing issue clusters.
- Use terminal-based findings for text-heavy critique, priority tables, and implementation recommendations.

## Deliverable

Produce a concise critique report with these sections:

1. **Executive verdict** — the strongest current impression and the biggest risk.
2. **What already works** — elements to preserve.
3. **Highest-impact fixes** — ranked changes that improve multiple audiences.
4. **Audience scorecard** — scores and rationale for each primary audience.
5. **Page-by-page notes** — homepage, projects/case studies, about/resume, blog, contact/navigation.
6. **Visual companion summary** — screenshots or visual comparisons when helpful.
7. **Recommended next implementation slice** — the smallest coherent set of improvements to do first.

## Success Criteria

- The critique is specific enough to turn into implementation tasks without re-investigating the site.
- Recommendations are prioritized; not every observation becomes a task.
- The existing terminal/dark aesthetic is treated as a constraint, not a problem to remove.
- The review distinguishes between quick polish, content strategy, and larger redesign work.
- The final recommendation identifies one next slice that is independently shippable.
