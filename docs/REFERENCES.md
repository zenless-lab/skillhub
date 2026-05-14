# References

> **Purpose:** Links to external documentation and tools used in skillhub.
> Add an entry whenever a non-obvious external dependency or specification is introduced.

## Skill Ecosystem

| Resource | URL | Notes |
| --- | --- | --- |
| Skill specification | <https://agentskills.io/llms.txt> | Canonical spec for SKILL.md format and metadata fields |
| `skills` CLI README | <https://github.com/vercel-labs/skills/blob/main/README.md> | Install, update, and manage skills from a registry |

## Tooling

| Resource | URL | Notes |
| --- | --- | --- |
| markdownlint | <https://github.com/DavidAnson/markdownlint/blob/main/README.md> | Node.js library used by `scripts/lint_markdown.mjs` |
| gray-matter | <https://github.com/jonschlinkert/gray-matter/blob/master/README.md> | YAML front matter parser used by `scripts/check_skill_meta.mjs` |
| gitleaks | <https://github.com/gitleaks/gitleaks/blob/main/README.md> | Secret and PII detection; rules in `.gitleaks.toml` |
| detect-secrets | <https://github.com/Yelp/detect-secrets/blob/main/README.md> | Entropy-based secret scanning |
| ruff | <https://github.com/astral-sh/ruff/blob/main/README.md> | Python linter and formatter |
| just | <https://github.com/casey/just/blob/master/README.md> | Task runner; recipes in `justfile` |
| pre-commit | <https://github.com/pre-commit/pre-commit/blob/main/README.md> | Hook framework; config in `.pre-commit-config.yaml` |
| TruffleHog | <https://github.com/trufflesecurity/trufflehog/blob/main/README.md> | Secret scanning in CI |

## Internal Links

| Document | Path | Notes |
| --- | --- | --- |
| Architecture | [ARCHITECTURE.md](../ARCHITECTURE.md) | Repository layout and skill structure conventions |
| Security | [SECURITY.md](../SECURITY.md) | PII and secret policies |
| Quality | [QUALITY.md](QUALITY.md) | Authoring standards and commit conventions |
| Sense | [SENSE.md](SENSE.md) | Product vision and scope boundaries |
