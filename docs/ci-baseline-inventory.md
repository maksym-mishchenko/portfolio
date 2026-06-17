# CI Baseline Inventory

## Repository

- Repo: maksym-mishchenko/portfolio
- Default branch: main
- Visibility: public
- External fork PRs accepted: yes
- Implementation branch: chore/fleet-ci-baseline-inventory

## Existing workflows

| Workflow | Path | State |
| --- | --- | --- |
| agent-state-freshness | .github/workflows/agent-state-freshness.yml | active |
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
| lint | CI / lint | planned yes after live proof | Existing lint signal is deterministic and can emit a normalized job name. |
| typecheck | CI / typecheck | planned yes after live proof | Existing strict TypeScript check is deterministic and can emit a normalized job name. |
| test | none | no | No `npm test` script or test files are present yet, so a required test gate would be synthetic. |
| build | CI / build | planned yes after live proof | Existing Next.js build is deterministic and can emit a normalized job name. |
| security | CI / security | planned yes after live proof | Blocking scope is limited to high-confidence secret patterns in added diff lines. |

## Security scan scope

- Blocking dependency scope: none in this phase. `npm audit --omit=dev --audit-level=high` currently reports pre-existing high advisories through deploy/build tooling (`@opennextjs/cloudflare`, `wrangler`, `esbuild`, `ws`) and is not reliable as a required gate yet.
- Blocking secret scope: CI `security` job scans only added diff lines for high-confidence token/private-key patterns and redacts by not printing matching lines.
- Advisory scope: existing full-history/working-tree Gitleaks workflows (`gitleaks`, `Secret Scan`), future dependency audit remediation, CodeQL, broad SAST, and AI-assisted scans until stable.
- Waiver tracking location: GitHub issue or security advisory reference.

## Non-required gates

- `test`: not configured because the repository has no test script or test files.
- `gitleaks / scan` and `Secret Scan / Gitleaks`: retained as advisory full-history/working-tree secret scans.
- `agent-state-freshness / state-freshness`: advisory because it depends on a self-hosted runner and freshness policy rather than core build correctness.
- `deploy` and `Vercel`: deploy/provider signals are not required during CI baseline enforcement.

## Deploy or release behavior

- Deploys or publishes artifacts: yes
- Secret-dependent PR checks: yes
- Protected environment required: no
- Smoke check command: npm run preview
- Rollback command or drill evidence: no documented rollback command found during inventory

## Transition safety

- Temporary maintainer bypass enabled during rollout: no
- Positive test PR: pending live verification
- Negative test PR: pending live verification
- Bypass removal PR or API update: pending live verification
- Required checks will not be added to `main` until the normalized gates emit terminal statuses on the normalization PR.
- Existing branch protection/ruleset settings will be preserved or strengthened only after positive proof; no force-push/delete allowance or broad bypass will be introduced.

## Captured governance state

- Branch protection: No branch protection returned by API; add later only after checks are normalized and proven.
- Repository rulesets returned: 0

## Enforcement evidence

- Normalization PR: pending
- Normalization head SHA: pending
- Terminal required-gate evidence: pending
- Applied required contexts: pending
- Branch protection/ruleset evidence: pending
- Negative PR: pending
- Negative blocked-merge evidence: pending
- Caveats: dependency audit is advisory until deploy/build-tool advisories are remediated or scoped to a reliable runtime-only surface.
