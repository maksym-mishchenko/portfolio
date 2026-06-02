# Maintenance Readiness Sweep Design

## Goal

Make the portfolio repository clean and safe for the next feature cycle after the Phase 3 blog search merge. This is a maintenance-only sweep: it does not add user-facing product functionality.

## Current Context

- `origin/main` contains the merged blog search work from PR #14.
- Local `main` is diverged from `origin/main` because it contains two local planning commits for the blog search spec and plan.
- There are no open GitHub PRs or issues at the time of design.
- `.agent/STATE.md` is stale: it still references the `/about` PR as in progress and lists blog search as future work.
- The repo has one remaining unrelated worktree for the case-study distribution kit branch.

## Recommended Approach

Run a maintenance-readiness sweep before starting new feature work.

1. Preserve the two local planning commits by moving them onto a dedicated docs branch.
2. Fast-forward local `main` to match `origin/main` after the commits are safely preserved.
3. Update repo state documentation so future agents see the real project state.
4. Inspect changelog, tag, and version status. Update release documentation only if the repo conventions require it for the recent shipped work.
5. Use a small PR for any tracked file changes.

This approach keeps history safe, avoids destructive git operations, and leaves the repository easier to reason about.

## Out of Scope

- No product UI changes.
- No new portfolio pages, blog posts, or case studies.
- No dependency upgrades unless required by an existing release/check process.
- No force-pushes, hard resets, or direct pushes to `main`.
- No cleanup of unrelated worktrees or branches unless they are proven stale and safe to remove.

## Workflow

### 1. Preserve Local Work

Before touching `main`, inspect the local commits that are ahead of `origin/main`.

If they are documentation/spec commits that should be retained, create or reuse a docs branch from the current local `main`. This branch becomes the safe home for those commits.

### 2. Sync `main`

After the local commits are preserved, switch back to `main` and update it to match `origin/main` using non-destructive operations. If a fast-forward is not possible, stop and report the exact branch graph instead of rewriting history.

### 3. Refresh Agent State

Update `.agent/STATE.md` so it reflects:

- Phase 1, Phase 2, `/about`, case study work, share kit, and blog search are complete.
- No open PRs or issues exist.
- Current next steps are maintenance, release hygiene, or the next intentionally selected feature.
- Known issues remain limited to verified current issues, such as existing non-failing lint warnings if still present.

### 4. Check Release Hygiene

Inspect `CHANGELOG.md`, existing git tags, and package version metadata. If recent shipped work requires a changelog or version/tag entry, update the smallest relevant documentation. If the repo does not currently use formal release entries for portfolio feature batches, document that finding in the final report rather than inventing a release process.

### 5. Create Reviewable Changes

If tracked files change, use a conventional commit on a maintenance/docs branch and create a PR that references the maintenance objective. If no files need changes, do not create an empty PR.

## Safeguards

- Never use `git reset --hard`.
- Never force-push.
- Never push directly to `main`.
- Check the current branch before edits.
- Preserve user or agent work before syncing branches.
- Keep documentation edits surgical and limited to stale state or release hygiene.

## Validation

The sweep is complete when:

- `main` can be shown as aligned with `origin/main`, or any remaining divergence is explicitly explained.
- Local planning commits are preserved on a named branch if they are not part of `origin/main`.
- `.agent/STATE.md` no longer contains stale open-PR or future-blog-search references.
- Open PR and issue checks show no unexpected work items.
- Final `git status` and `git worktree list` output are reviewed.
- Any documentation changes are committed on a non-main branch and ready for PR review.

## Success Criteria

- Future work can start from a clean, understandable repository state.
- No work is lost.
- No destructive git operation is used.
- The repo's agent-facing state matches GitHub reality.
- The next feature can be planned without first untangling local branch state.
