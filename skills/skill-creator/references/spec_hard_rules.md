# Skill Specification: Hard Rules

Every constraint a validator enforces. Violating any rule makes the skill invalid.

## `SKILL.md` Structure

The file MUST contain YAML frontmatter delimited by `---` followed by a Markdown body.

```text
---
<frontmatter fields>
---

<Markdown body>
```

---

## Required Fields

### `name`

| Constraint | Detail |
| --- | --- |
| Required | Yes |
| Max length | 64 characters |
| Allowed characters | Lowercase `a-z`, digits `0-9`, hyphens `-` |
| Leading/trailing hyphen | **Not allowed** |
| Consecutive hyphens | **Not allowed** (`pdf--processing` is invalid) |
| Directory match | **Must exactly match the parent directory name** |

Valid:

```yaml
name: pdf-processing
name: data-analysis-v2
name: code-review
```

Invalid:

```yaml
name: PDF-Processing   # uppercase not allowed
name: -pdf             # cannot start with hyphen
name: pdf--processing  # consecutive hyphens not allowed
name: pdf_processing   # underscore not allowed
name: pdf processing   # space not allowed
```

### `description`

| Constraint | Detail |
| --- | --- |
| Required | Yes |
| Max length | **1024 characters** |
| Min length | 1 character (non-empty) |

The description is the **only** text an agent reads before deciding to activate the skill. Include:

- What the skill does (action verbs, domain keywords)
- When to use it (trigger conditions, even when the user doesn't name the domain explicitly)

Good:

```yaml
description: >
  Extracts text and tables from PDF files, fills PDF forms, and merges multiple
  PDFs. Use when working with PDF documents or when the user mentions PDFs,
  forms, or document extraction.
```

Poor:

```yaml
description: Helps with PDFs.
```

---

## Optional Fields

### `license`

- String. Short license name or path to a bundled license file.
- No hard length constraint; keep it brief.

```yaml
license: MIT
license: Proprietary. See LICENSE.txt for complete terms.
```

### `compatibility`

| Constraint | Detail |
| --- | --- |
| Max length | **500 characters** if provided |
| When to include | Only when the skill has specific environment requirements |

```yaml
compatibility: Requires Python 3.12+ and uv
compatibility: Requires git, docker, and internet access
```

Omit this field if the skill runs in any standard agent environment.

### `metadata`

- A flat key-value map (`string → string`).
- Use reasonably unique key names to avoid conflicts.

```yaml
metadata:
  author: acme-org
  version: "1.0"
```

### `allowed-tools`

- Space-separated string of pre-approved tool names.
- **Experimental.** Support varies by agent implementation.

```yaml
allowed-tools: Bash(git:*) Bash(jq:*) Read
```

---

## Directory Structure Rules

```text
skill-name/            ← must match the `name` field in SKILL.md
├── SKILL.md           ← required
├── scripts/           ← optional
├── references/        ← optional
├── assets/            ← optional
└── ...                ← any additional files or directories
```

- The root directory name **must equal** the `name` frontmatter field.
- No naming constraints on files inside subdirectories.

---

## Body Content Rules

- No mandatory format restrictions.
- **Recommended limit:** under **500 lines** and **5,000 tokens**.
- If more content is needed, move reference material to `references/` and load it on demand.
- File references inside the body **must use relative paths from the skill directory root**.
- Prefer references no more than one directory level deep from `SKILL.md`.

## Progressive Disclosure Limits

| Stage | Content | Recommended size |
| --- | --- | --- |
| Metadata | `name` + `description` only | ~100 tokens |
| Instructions | Full `SKILL.md` body | < 5,000 tokens |
| Resources | Files in `scripts/`, `references/`, `assets/` | Loaded on demand |

Tell the agent **when** to load each reference file rather than loading all files unconditionally.
