# Quality

> **Purpose:** Defines authoring standards, tooling conventions, and the commit workflow
> for skillhub. Read this before creating or modifying a skill, writing scripts, or
> opening a pull request. Update when conventions change.

## Skill Authoring Standards

| Rule | Detail |
| --- | --- |
| Entry point | `SKILL.md` is the only required file; no per-skill `README.md` |
| Front matter | Must include `name` and `description` fields with `---` delimiters |
| `description` length | Hard limit: 1024 chars. Aim for ≤512 chars |
| SKILL.md length | No hard limit; >500 lines triggers a warning, >1000 a stronger warning |
| Progressive disclosure | Put detailed reference files in `references/`, not in skill root |
| Cross-framework | No framework-specific instructions (Copilot/Claude/Cursor/etc.) |
| Inter-skill references | Include `skills` CLI instructions for obtaining any referenced skill |
| Layout | `references/`, `assets/`, `scripts/` per skill; no flat dumps in skill root |

Validate with `just check-skill-metadata`.

## Commit Convention

All commits must follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/):

```text
<type>(<scope>): <short description>
```

**Scope** is the directory or domain being changed:

| Change | Scope example |
| --- | --- |
| Modifying a skill | `feat(chezmoi-creator): ...` |
| Project docs or harness files | `docs(harness): ...` |
| CI scripts or tooling | `ci(justfile): ...` |
| Pre-commit hooks | `ci(pre-commit): ...` |

Enforcement is by convention, not by a pre-commit hook. Reviewers should reject commits that do not follow the format.

## Markdown Standards

Configuration: [`.markdownlint.json`](../.markdownlint.json) at the repository root.

| Rule | Setting |
| --- | --- |
| Line length (`MD013`) | Disabled — no hard limit |
| First-line heading (`MD041`) | Disabled — SKILL.md starts with front matter |
| Heading blank lines (`MD022`) | Disabled |
| Unordered list indent (`MD007`) | 2 spaces |
| Inline HTML (`MD033`) | Allowed: `<sub>`, `<sup>`, `<br>`, `<details>`, `<summary>` |

Run `just lint-markdown` or `npm run lint:md` to check.

## Python Standards

- **Linter/formatter:** `ruff` (config: [`ruff.toml`](../ruff.toml), default settings)
- Run `just lint-python` to check and auto-fix.

## PII and Secret Standards

See [SECURITY.md](../SECURITY.md) for the full policy. PII and secret scanning run automatically via pre-commit hooks on every `git commit`.

## Pre-Commit Hooks

Installed via `pre-commit install`. Runs automatically on `git commit`.

| Hook | What it checks |
| --- | --- |
| `trailing-whitespace` | Removes trailing whitespace |
| `end-of-file-fixer` | Ensures files end with a newline |
| `check-yaml` | Validates YAML syntax |
| `check-merge-conflict` | Blocks commits with merge conflict markers |
| `check-added-large-files` | Blocks files > 2 MB |
| `detect-secrets` | High-entropy strings and known secret patterns |
| `gitleaks` | Secrets and PII (email, IPv4, IPv6) per `.gitleaks.toml` |
| `ruff` + `ruff-format` | Python linting and formatting |
| `lint-markdown` | Markdown lint via `scripts/lint_markdown.mjs` |
| `check-skill-metadata` | SKILL.md front matter and length validation via `scripts/check_skill_meta.mjs` |

## Post-Task Checklist

After completing any task in this repository, run:

```bash
just check
```

If the task added or changed a skill, also verify that `README.md` reflects the change.
