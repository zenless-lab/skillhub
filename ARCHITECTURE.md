# Architecture

> **Purpose:** Top-level map of the skillhub repository structure, conventions, and design
> principles. Read this before adding a skill, reorganizing directories, or changing
> project-level tooling. Update whenever the skill structure or tooling conventions change.

## Project Overview

**Name:** skillhub

**Summary:** A curated library of AI Agent skills designed for cross-framework use.
Skills are self-contained instruction sets that agents load on demand to perform
specialized tasks. The library is managed via the `skills` CLI and distributed as a
GitHub-hosted package through `zenless-lab/skillhub`.

## Repository Layout

```text
skillhub/
├── skills/                  # All public skills — flat, no nested subdirectories
│   └── <skill-name>/
│       ├── SKILL.md         # Agent entry point — the only required file per skill
│       ├── references/      # Heavy reference material loaded on demand by the agent
│       ├── assets/          # Executable templates and sample files
│       └── scripts/         # Helper scripts used by the skill workflow
├── scripts/                 # Project-level CI scripts
│   ├── lint_markdown.mjs    # Markdown linting script
│   └── check_skill_meta.mjs # SKILL.md metadata and length validator
├── docs/                    # Project knowledge base
│   ├── QUALITY.md           # Code and authoring standards
│   ├── SENSE.md             # Product vision and principles
│   └── REFERENCES.md        # External documentation links
├── AGENTS.md                # Agent entry point for this repository
├── ARCHITECTURE.md          # This file
├── SECURITY.md              # Security policies and tooling
├── justfile                 # CI command recipes
├── .gitleaks.toml           # PII and secret detection rules
├── .markdownlint.json       # Markdown lint rules
├── ruff.toml                # Python lint configuration
├── .pre-commit-config.yaml  # Pre-commit hook definitions
└── skills-lock.json         # Dependency lock file for installed skills
```

## Skill Structure Convention

Every skill follows the same internal layout. The only required file is `SKILL.md`.

| Path | Purpose | Required |
| --- | --- | --- |
| `SKILL.md` | Agent entry point; concise, actionable instructions | Yes |
| `references/` | Detailed reference material loaded on demand | No |
| `assets/` | Template files, sample configs, example outputs | No |
| `scripts/` | Helper scripts invoked by the skill's workflow | No |

**Rules:**

- Do not add a `README.md` per skill. `SKILL.md` is the entry point.
- `skills/` is flat — all skills live directly under `skills/`, never in subdirectories.
- `SKILL.md` front matter must include `name` and `description` fields.
- Reference files are loaded on demand to minimize agent context usage (progressive disclosure).

## Cross-Framework Universality

Skills must not contain instructions specific to a single AI framework (e.g., Copilot,
Claude, Cursor). All workflow steps, commands, and references must work regardless of
which agent or tool is loading the skill.

When a skill's workflow benefits from another skill, it must include instructions for
obtaining that skill via the `skills` CLI (see [docs/REFERENCES.md](docs/REFERENCES.md)),
rather than assuming it is already installed.

## Technology Stack

| Concern | Technology |
| --- | --- |
| Skill distribution | `skills` CLI (`vercel-labs/skills`) |
| Markdown linting | `markdownlint` (Node.js library) |
| CI scripts | Node.js (`scripts/*.mjs`) |
| Secret and PII detection | `gitleaks` + `detect-secrets` + GitHub Actions TruffleHog |
| Task runner | `just` (`rust-just`) |
| Pre-commit hooks | `pre-commit` |
| CI | GitHub Actions (`.github/workflows/`) |
