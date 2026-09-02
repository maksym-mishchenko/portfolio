# CI Baseline Inventory

Current inventory note (2026-09-02): the advisory agent-state-freshness workflow was retired. Historical enforcement evidence below is preserved as point-in-time evidence and does not describe the current workflow set.

## Repository

- Repo: maksym-mishchenko/portfolio
- Default branch: main
- Visibility: public
- External fork PRs accepted: yes
- Implementation branch: chore/fleet-ci-baseline-inventory

## Existing workflows

| Workflow | Path | State |
| --- | --- | --- |
| Blog Auto-Publish | .github/workflows/blog-autopublish.yml | active |
| CI | .github/workflows/ci.yml | active |
| Cloudflare Deploy | .github/workflows/cloudflare-deploy.yml | active |
| gitleaks | .github/workflows/gitleaks.yml | active |
| Secret Scan | .github/workflows/secret-scan.yml | active |

## Current emitted checks

| Check | Status behavior | Required today |
| --- | --- | --- |
| deploy | terminal success | no |
| Vercel | terminal success on main | no |

## Target normalized gates

| Gate | Source workflow/job | Required in this phase | Reason |
| --- | --- | --- | --- |
| lint | CI / lint | yes | Existing lint signal emitted terminal success on PR #50. |
| typecheck | CI / typecheck | yes | Existing strict TypeScript check emitted terminal success on PR #50. |
| test | none | no | No `npm test` script or test files are present yet, so a required test gate would be synthetic. |
| build | CI / build | yes | Existing Next.js build emitted terminal success on PR #50 and terminal failure on negative PR #51. |
| security | CI / security | yes | Blocking scope is limited to high-confidence secret patterns in added diff lines and emitted terminal success on PR #50. |

## Security scan scope

- Blocking dependency scope: none in this phase. `npm audit --omit=dev --audit-level=high` currently reports pre-existing high advisories through deploy/build tooling (`@opennextjs/cloudflare`, `wrangler`, `esbuild`, `ws`) and is not reliable as a required gate yet.
- Blocking secret scope: CI `security` job scans only added diff lines for high-confidence token/private-key patterns and redacts by not printing matching lines.
- Advisory scope: existing full-history/working-tree Gitleaks workflows (`gitleaks`, `Secret Scan`), future dependency audit remediation, CodeQL, broad SAST, and AI-assisted scans until stable.
- Waiver tracking location: GitHub issue or security advisory reference.

## Non-required gates

- `test`: not configured because the repository has no test script or test files.
- `gitleaks / scan` and `Secret Scan / Gitleaks`: retained as advisory full-history/working-tree secret scans.
- `deploy` and `Vercel`: deploy/provider signals are not required during CI baseline enforcement.

## Deploy or release behavior

- Deploys or publishes artifacts: yes
- Secret-dependent PR checks: yes
- Protected environment required: no
- Smoke check command: npm run preview
- Rollback command or drill evidence: no documented rollback command found during inventory

## Transition safety

- Temporary maintainer bypass enabled during rollout: no
- Positive test PR: https://github.com/maksym-mishchenko/portfolio/pull/50
- Negative test PR: https://github.com/maksym-mishchenko/portfolio/pull/51 (closed unmerged)
- Bypass removal PR or API update: not applicable; no temporary bypass was created.
- Required checks were added to `main` only after the normalized gates emitted terminal statuses on PR #50.
- Branch protection now disallows force pushes and deletions, enforces admins, requires conversation resolution, and has no bypass actors/rulesets.

## Captured governance state

- Branch protection: enabled on `main` after PR #50 proof. Required status checks are strict and require `lint`, `typecheck`, `build`, and `security`; admins are enforced; force pushes/deletions disabled; conversation resolution required; review requirements remain unset.
- Repository rulesets returned: 0

## Enforcement evidence

- Normalization PR: https://github.com/maksym-mishchenko/portfolio/pull/50
- Normalization head SHA: `04a298e596b7ddbc6e2e2b1488032e2e366e1749`
- Terminal required-gate evidence on PR #50:
  - `lint`: SUCCESS, https://github.com/maksym-mishchenko/portfolio/actions/runs/27683907744/job/81877869486
  - `typecheck`: SUCCESS, https://github.com/maksym-mishchenko/portfolio/actions/runs/27683907744/job/81877869488
  - `build`: SUCCESS, https://github.com/maksym-mishchenko/portfolio/actions/runs/27683907744/job/81877869470
  - `security`: SUCCESS, https://github.com/maksym-mishchenko/portfolio/actions/runs/27683907744/job/81877869497
- Applied required contexts: `lint`, `typecheck`, `build`, `security` on default branch `main`, with strict up-to-date checks.
- Branch protection/ruleset evidence: branch protection API returned required contexts `lint`, `typecheck`, `build`, `security`; `enforce_admins.enabled=true`; `allow_force_pushes.enabled=false`; `allow_deletions.enabled=false`; `required_conversation_resolution.enabled=true`; `restrictions=null`; repository rulesets `[]`.
- Negative PR: https://github.com/maksym-mishchenko/portfolio/pull/51, head SHA `45cc3ca9a523d9895bb2d0746c8b8b3db92e35ba`, closed unmerged.
- Negative blocked-merge evidence: PR #51 `mergeStateStatus=BLOCKED`; `build` terminal FAILURE at https://github.com/maksym-mishchenko/portfolio/actions/runs/27684616464/job/81880210823 while `lint`, `typecheck`, `security`, and `state-freshness` were terminal SUCCESS.
- Caveats: dependency audit is advisory until deploy/build-tool advisories are remediated or scoped to a reliable runtime-only surface; full-history/working-tree Gitleaks, GitGuardian, Vercel, and deploy signals remain non-required.
