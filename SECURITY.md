# Security

## Secret scanning

This repository uses Gitleaks in CI and as an optional local pre-commit/pre-push hook to prevent secrets from being committed.

Install the local hook:

```bash
brew install pre-commit gitleaks
pre-commit install
pre-commit install --hook-type pre-push
```

Run a manual scan before pushing sensitive changes:

```bash
gitleaks detect --source . --no-git --verbose
```

If a secret is found in git history, rotate it immediately before removing it from the repository. Treat committed secrets as compromised.
