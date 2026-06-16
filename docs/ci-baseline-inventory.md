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
| Secret Scan | .github/workflows/secret-scan.yml | active |

## Current emitted checks

| Check | Status behavior | Required today |
| --- | --- | --- |
| deploy | terminal success | no |

## Target normalized gates

| Gate | Source workflow/job | Required in this phase | Reason |
| --- | --- | --- | --- |
| lint | existing lint script/workflow | yes | Existing lint signal can be normalized. |
| typecheck | existing typecheck script/workflow | yes | Existing typecheck signal can be normalized. |
| test | existing test command/workflow | yes | Tests should be part of normalized CI when present. |
| build | existing build script/workflow | yes | Build should be part of normalized CI when present. |
| security | existing security scan workflow/check | no | Keep advisory until scan noise and scope are stable. |

## Security scan scope

- Blocking dependency scope: runtime dependencies and PR-introduced findings when supported.
- Blocking secret scope: diff secret scanning.
- Advisory scope: full-history secrets, CodeQL, broad SAST, AI-assisted scans until stable.
- Waiver tracking location: GitHub issue or security advisory reference.

## Deploy or release behavior

- Deploys or publishes artifacts: yes
- Secret-dependent PR checks: yes
- Protected environment required: no
- Smoke check command: npm run preview
- Rollback command or drill evidence: no documented rollback command found during inventory

## Transition safety

- Temporary maintainer bypass enabled during rollout: no
- Positive test PR: URL-after-verification
- Negative test PR: URL-after-verification
- Bypass removal PR or API update: URL-after-verification

## Captured governance state

- Branch protection: No branch protection returned by API; add later only after checks are normalized and proven.
- Repository rulesets returned: 0
