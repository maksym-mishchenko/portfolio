# Case Study Distribution Kit Design

## Goal

Turn the merged mcpgate flagship case study into a reusable hiring signal. The feature should help Maksym quickly share the case study with recruiters, hiring managers, and technical reviewers without rewriting positioning copy for each channel.

## Audience

Primary audience: recruiters and hiring managers who need a fast signal that Maksym can identify and reduce AI-agent security risk before it becomes production damage.

Secondary audience: technical reviewers who want a concise explanation of the engineering judgment behind mcpgate without reading the full case study first.

## Problem

The case study is now live, but its value still depends on someone discovering it and extracting the right summary. That creates friction when using it in LinkedIn posts, GitHub profile text, resume bullets, direct recruiter messages, or portfolio navigation.

## Recommended Approach

Add a small distribution kit around the existing case study rather than building a larger marketing system.

The kit provides copy-ready variants for common sharing contexts:

- One-line positioning statement.
- Three-bullet recruiter summary.
- LinkedIn post draft.
- GitHub profile or README blurb.
- Resume bullet.
- Short recruiter outreach message.

The kit should be accessible from the case-study page and optionally from the homepage project/case-study CTA. It should not require new dependencies, authentication, persistence, analytics, or external APIs.

## User Experience

On the mcpgate case-study page, add a clear but lightweight "Share-ready summary" CTA. The CTA should lead to either:

1. A dedicated `/case-studies/mcpgate-v1-1/share` route, or
2. An anchored section on the existing case-study page.

Prefer a dedicated route if implementation stays simple, because it keeps the full case study focused while giving the distribution content a clean URL.

The share page or section should present concise cards with labels such as "LinkedIn post", "Recruiter message", and "Resume bullet". Each card should show copy that can be manually selected and copied. A copy-to-clipboard button is optional and should only be added if it does not introduce client-side complexity or accessibility risk.

## Content Model

Store the distribution copy in a typed helper or constant close to case-study content, not inline inside React components.

Suggested shape:

```ts
type CaseStudyShareKit = {
  slug: string;
  positioning: string;
  recruiterSummary: string[];
  linkedinPost: string;
  githubBlurb: string;
  resumeBullet: string;
  recruiterMessage: string;
};
```

The first implementation can support only the mcpgate case study, but the type should not block future case studies from adding their own share kits.

## Architecture

- Reuse the existing case-study loader and route patterns.
- Add a small share-kit data source in `src/lib/` or extend the case-study metadata module if that keeps boundaries clean.
- Add a route or section component that renders the share variants.
- Link to the kit from the mcpgate case-study detail page.
- Optionally add one homepage/project CTA if it improves discoverability without cluttering the terminal aesthetic.

## Out of Scope

- Automatic social posting.
- URL shorteners or tracking links.
- Analytics dashboards.
- AI-generated copy.
- Multi-case-study management UI.
- Dark/light theme changes.

## Error Handling

If a share kit is requested for a case study without configured copy, the route should return `notFound()` rather than rendering empty or misleading content.

If implemented as an anchored section, only render the share section when copy exists.

## Accessibility and UX Constraints

- All share content must be visible as plain text.
- Cards must have semantic headings.
- If copy buttons are added, they must have accessible labels and visible success feedback.
- The page should remain useful without JavaScript.

## Success Criteria

- A recruiter can understand the mcpgate value proposition in under 30 seconds.
- Maksym can copy a LinkedIn post, resume bullet, GitHub blurb, and recruiter message without rewriting them manually.
- The case-study page gains a clear path to the share-ready summary.
- No new dependencies are added.
- Existing lint, type-check, and build commands still pass.

## Implementation Notes

Keep the copy direct and outcome-oriented. The strongest framing is:

> I can identify and reduce AI-agent security risk before it becomes production damage.

Avoid overstating impact. Focus on engineering judgment, risk reduction, validation, and practical security controls.
