# Maintenance Readiness Sweep Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up local repository state, refresh agent-facing project state, and update release hygiene after the blog search merge.

**Architecture:** This is a repository maintenance workflow, not a product feature. Preserve local planning commits on a docs branch, align local `main` with `origin/main`, update only stale documentation/state files, and open a small issue-linked PR for reviewable tracked changes.

**Tech Stack:** Git, GitHub CLI (`gh`), Markdown, Next.js repo conventions.

---

## File Structure

- Modify: `.agent/STATE.md`
  - Responsibility: agent-facing project state, completed work, known issues, and next steps.
- Modify: `CHANGELOG.md`
  - Responsibility: Keep a Changelog `[Unreleased]` entries for recent agent-authored shipped work and this maintenance sweep.
- No product source files are modified.
- No tests are added because the sweep changes repository metadata and documentation only.

## Task 1: Create GitHub Issue for the Maintenance Sweep

**Files:**
- No file changes.

- [ ] **Step 1: Confirm current branch and GitHub state**

Run:

```bash
git branch --show-current
git --no-pager status --short --branch
GH_PAGER=cat gh pr list --state open --limit 20 --json number,title,state,headRefName,url
GH_PAGER=cat gh issue list --state open --limit 30 --json number,title,labels,url
```

Expected:

```text
docs/maintenance-readiness-sweep-spec
## docs/maintenance-readiness-sweep-spec
[]
[]
```

If there are unexpected file changes, stop and inspect them before continuing. If there are open PRs or issues, decide whether this maintenance issue already exists before creating a duplicate.

- [ ] **Step 2: Create the issue**

Run:

```bash
GH_PAGER=cat gh issue create \
  --title "Run portfolio maintenance readiness sweep" \
  --body "## Summary

Run a maintenance-readiness sweep after the Phase 3 blog search merge.

## Scope

- Preserve local planning commits on a docs branch.
- Align local main with origin/main without force-push or hard reset.
- Refresh .agent/STATE.md so it matches the current GitHub state.
- Update CHANGELOG.md [Unreleased] entries for recent shipped agent work and this maintenance sweep.
- Open a small PR for reviewable documentation/state changes.

## Acceptance Criteria

- Local planning commits are preserved on a named branch.
- Local main is aligned with origin/main, or any remaining divergence is explicitly explained.
- .agent/STATE.md no longer references stale open PRs or blog search as future work.
- CHANGELOG.md includes the maintenance sweep and recent shipped work in [Unreleased].
- No product source files are changed.
- No destructive git operations are used."
```

Expected:

```text
https://github.com/maksym-mishchenko/portfolio/issues/<issue-number>
```

Save the returned issue number for later commands. In the examples below, replace `<issue-number>` with the actual number.

## Task 2: Preserve Local Planning Commits and Align Local `main`

**Files:**
- No file changes.

- [ ] **Step 1: Verify the docs branch preserves local work**

Run:

```bash
git --no-pager log --oneline --decorate -5
git branch --contains f1a14df
git branch --contains 12cd1c3
```

Expected:

```text
2984624 (HEAD -> docs/maintenance-readiness-sweep-spec) docs: specify maintenance readiness sweep
12cd1c3 docs(blog): plan search implementation
f1a14df docs(blog): specify client-side search
f11e699 feat(about): add professional snapshot page (#11)
  docs/maintenance-readiness-sweep-spec
  main
```

The key requirement is that `docs/maintenance-readiness-sweep-spec` appears in both `git branch --contains` outputs. If it does not, stop and create a preservation branch from current `main` before touching `main`:

```bash
git branch docs/preserved-blog-search-planning main
```

- [ ] **Step 2: Fetch remote state**

Run:

```bash
git fetch origin --prune
git --no-pager log --oneline --decorate --left-right --cherry-pick main...origin/main
```

Expected:

```text
> 0efa231 (origin/main, origin/HEAD) feat(blog): add client-side post search (#13) (#14)
< 12cd1c3 docs(blog): plan search implementation
< f1a14df docs(blog): specify client-side search
```

If the output contains additional unexpected commits, stop and inspect them before changing `main`.

- [ ] **Step 3: Align local `main` with `origin/main`**

Run from `docs/maintenance-readiness-sweep-spec`:

```bash
git branch -f main origin/main
git --no-pager log --oneline --decorate --left-right --cherry-pick main...origin/main
```

Expected:

```text
```

The second command should print no commits. This moves the local `main` branch pointer only after the local planning commits are preserved on `docs/maintenance-readiness-sweep-spec`. Do not use `git reset --hard`.

- [ ] **Step 4: Verify current branch and worktree list**

Run:

```bash
git branch --show-current
git worktree list --porcelain
```

Expected:

```text
docs/maintenance-readiness-sweep-spec
worktree /Users/maksymmishchenko/Projects/portfolio
HEAD 2984624713aa5214f8e1e5b171aff8e68ac0af11 or a later commit on docs/maintenance-readiness-sweep-spec
branch refs/heads/docs/maintenance-readiness-sweep-spec

worktree /Users/maksymmishchenko/Projects/portfolio/.worktrees/case-study-distribution-kit
HEAD f87b58ac86b1a2be06c3e78773901e29d8f04708
branch refs/heads/feat/case-study-distribution-kit
```

The case-study distribution kit worktree is unrelated and should remain untouched.

## Task 3: Refresh `.agent/STATE.md`

**Files:**
- Modify: `.agent/STATE.md`

- [ ] **Step 1: Replace the stale state content**

Open `.agent/STATE.md` and replace the whole file with:

```markdown
# State — portfolio
Last updated: 2026-06-02 by Copilot

## Done
- Phase 1 complete: /resume print-to-PDF, per-post OG images, JSON-LD Person/BlogPosting,
  RSS footer link, /now page, neutral status badge (SITE.status in Hero.tsx). [PR #6 merged]
- Phase 2 complete: richer project cards with `Project.thumbnail`, terminal SVG thumbnails,
  and `learned` lines. [PR #7 merged]
- Flagship mcpgate case study shipped at `/case-studies/mcpgate-v1-1`. [PR #8 merged]
- Case-study distribution kit shipped at `/case-studies/mcpgate-v1-1/share`. [PR #9 merged]
- About professional snapshot shipped at `/about`. [PR #11 merged]
- Phase 3 blog search shipped: `/blog` remains server-rendered and delegates client-side
  filtering to `BlogSearch`. Search covers title, description, date, reading time, and tags. [PR #14 merged]

## In progress
- Maintenance readiness sweep: preserve local planning commits, align local `main` with
  `origin/main`, refresh agent state, and update changelog hygiene.

## Known issues
- 6 non-failing lint warnings remain in `mdx/interactive/InteractiveFlow.tsx`
  (unused props/setters/import), if still present after the next lint run.

## Next steps
- Complete the maintenance readiness sweep PR.
- Decide the next product/content investment after repo state is clean.
- Future: swap generated SVG thumbnails for real screenshots if desired.
```

- [ ] **Step 2: Verify stale references are gone**

Run:

```bash
rg "PR pending|blog search over|Phase 3 backlog|issue-10/about-professional-snapshot|future work" .agent/STATE.md
```

Expected:

```text
No matches found.
```

- [ ] **Step 3: Verify intended content is present**

Run:

```bash
rg "PR #14 merged|Maintenance readiness sweep|Last updated: 2026-06-02 by Copilot" .agent/STATE.md
```

Expected:

```text
.agent/STATE.md:2:Last updated: 2026-06-02 by Copilot
.agent/STATE.md:<line>:- Phase 3 blog search shipped: ...
.agent/STATE.md:<line>:- Maintenance readiness sweep: preserve local planning commits, align local `main` with
```

## Task 4: Update `CHANGELOG.md`

**Files:**
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Update `[Unreleased]` entries**

Edit `CHANGELOG.md` so the `[Unreleased]` section becomes:

```markdown
## [Unreleased]

### Added
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
```

- [ ] **Step 2: Confirm no version/tag release was invented**

Run:

```bash
git tag --sort=-creatordate | head -20
node -p "require('./package.json').version"
```

Expected:

```text
0.1.1
```

If tags are still absent, do not create a tag in this task. This sweep documents `[Unreleased]` work only.

- [ ] **Step 3: Verify changelog entries**

Run:

```bash
rg "PR #6|PR #7|PR #8|PR #9|PR #11|PR #14|Maintenance readiness sweep|Refreshed agent-facing" CHANGELOG.md
```

Expected: matching lines for each PR and maintenance entry.

## Task 5: Validate, Commit, Push, and Open PR

**Files:**
- Modify: `.agent/STATE.md`
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Review the diff**

Run:

```bash
git --no-pager diff -- .agent/STATE.md CHANGELOG.md
```

Expected:

```text
diff --git a/.agent/STATE.md b/.agent/STATE.md
diff --git a/CHANGELOG.md b/CHANGELOG.md
```

The diff should contain only the state refresh and changelog updates described in Tasks 3 and 4.

- [ ] **Step 2: Run documentation-safe validation commands**

Run:

```bash
git --no-pager status --short --branch
GH_PAGER=cat gh pr list --state open --limit 20 --json number,title,state,headRefName,url
GH_PAGER=cat gh issue list --state open --limit 30 --json number,title,labels,url
git --no-pager log --oneline --decorate --left-right --cherry-pick main...origin/main
git worktree list --porcelain
```

Expected:

```text
## docs/maintenance-readiness-sweep-spec
 M .agent/STATE.md
 M CHANGELOG.md
[]
<issue list includes the maintenance sweep issue>
<main...origin/main prints no commits>
<worktree list includes this branch and the unrelated case-study distribution kit worktree>
```

Full Next.js build is not required because only Markdown/state documentation changes are made.

- [ ] **Step 3: Commit the maintenance updates**

Run:

```bash
git add .agent/STATE.md CHANGELOG.md
git commit -m "docs: refresh maintenance readiness state" \
  -m "Closes #<issue-number>" \
  -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

Expected:

```text
[docs/maintenance-readiness-sweep-spec <sha>] docs: refresh maintenance readiness state
 2 files changed, ...
```

- [ ] **Step 4: Push the branch**

Run:

```bash
git push -u origin docs/maintenance-readiness-sweep-spec
```

Expected:

```text
branch 'docs/maintenance-readiness-sweep-spec' set up to track 'origin/docs/maintenance-readiness-sweep-spec'
```

- [ ] **Step 5: Open the PR**

Run:

```bash
GH_PAGER=cat gh pr create \
  --base main \
  --head docs/maintenance-readiness-sweep-spec \
  --title "docs: refresh maintenance readiness state" \
  --body "Closes #<issue-number>

## Summary

- Preserves local planning commits on a docs branch before aligning local main.
- Refreshes .agent/STATE.md after the merged portfolio work.
- Updates CHANGELOG.md [Unreleased] entries for recent shipped agent work and this maintenance sweep.

## Validation

- Checked branch divergence for main...origin/main.
- Checked open PR and issue state.
- Reviewed git worktree list.
- Skipped Next.js build because only Markdown/state documentation changed."
```

Expected:

```text
https://github.com/maksym-mishchenko/portfolio/pull/<pr-number>
```

- [ ] **Step 6: Final local report**

Run:

```bash
git --no-pager status --short --branch
git --no-pager log --oneline --decorate --left-right --cherry-pick main...origin/main
git worktree list --porcelain
GH_PAGER=cat gh pr view --json number,state,url,headRefName,baseRefName,title
```

Expected:

```text
## docs/maintenance-readiness-sweep-spec...origin/docs/maintenance-readiness-sweep-spec
<main...origin/main prints no commits>
<worktree list includes this branch and the unrelated case-study distribution kit worktree>
{"number":<pr-number>,"state":"OPEN",...}
```

Report the PR URL and any remaining non-blocking notes.

## Self-Review

- Spec coverage: The plan covers local work preservation, local `main` alignment, agent state refresh, release hygiene inspection/update, PR creation, safeguards, and validation.
- Placeholder scan: No unresolved marker text remains. `<issue-number>` and `<pr-number>` are runtime values produced by GitHub and are explicitly defined by earlier commands.
- Type/signature consistency: Not applicable; this plan changes Markdown and git/GitHub state only.
