# Agent Instructions

Entry point for AI agents working in skillhub. Keep this file short.
Deep context lives in [`docs/`](docs/) — this file is the map, not the manual.

## Project Context

- **Description:** A curated library of cross-framework AI Agent skills distributed via the `skills` CLI.
- **Stack:** Markdown (skills), Node.js (CI scripts)
- **Distribution:** GitHub-hosted at `zenless-lab/skillhub`; installed with `skills add zenless-lab/skillhub/<name>`
- **Architecture:** See [ARCHITECTURE.md](ARCHITECTURE.md) for repository layout and skill structure rules.

## Setup

```bash
pre-commit install          # install git hooks (once, after cloning)
just check                  # run all quality checks
just run-pre-commit-all     # run all pre-commit hooks on every file
```

## Code Style & Conventions

- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) — `type(scope): description`
  where scope is the skill name (e.g., `chezmoi-creator`) or `harness`, `docs`, or `ci` for project changes.
- **Skill layout:** `SKILL.md` + `references/` + `assets/` + `scripts/` — no per-skill `README.md`.
- **skills/ is flat:** all skills live directly under `skills/`, never in subdirectories.
- **Cross-framework:** no framework-specific (Copilot/Claude/Cursor) instructions in any skill.
- **Inter-skill references:** always include `skills add` instructions when referencing another skill.
- **No PII or secrets:** pre-commit hooks enforce this automatically on every commit. See [SECURITY.md](SECURITY.md).

## Knowledge Base

| When working on... | Read... |
| --- | --- |
| Skill authoring standards, commit format, or tooling | [docs/QUALITY.md](docs/QUALITY.md) |
| Security policy, PII rules, or secret handling | [SECURITY.md](SECURITY.md) |
| Repository layout or skill structure conventions | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Product vision, scope decisions, or principles | [docs/SENSE.md](docs/SENSE.md) |
| External tool docs or install commands | [docs/REFERENCES.md](docs/REFERENCES.md) |

## File Sync Rules

When structure or content changes, keep all affected files in sync.
Stale information is more harmful than missing information — update or delete, never leave outdated content.

| When... | Also update... |
| --- | --- |
| A skill is added or renamed | `README.md` (skill list), `ARCHITECTURE.md` if layout changes |
| A skill is removed | `README.md`, `skills-lock.json` if it was locked |
| Project tooling changes | `ARCHITECTURE.md` (tech stack), `docs/QUALITY.md` (hooks/recipes) |
| CI scripts or hooks change | `docs/QUALITY.md` (pre-commit table, justfile table) |
| Security tooling changes | `SECURITY.md` (detection stack table) |

## Post-Task Checklist

After completing any task:

1. Run `just check` — fix all errors before marking the task done.
2. If a skill was added or changed — verify `README.md` reflects the change.
3. If project structure changed — verify all harness docs above are still accurate.
