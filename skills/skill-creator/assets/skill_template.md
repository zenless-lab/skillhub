---
name: [skill-name]
description: >
  [Action verbs + domain keywords + trigger conditions. Use imperative phrasing:
  "Use when...". Cover indirect phrasings the user might say without
  naming the domain explicitly. 1–1024 characters.
  Example: "Extract text and tables from PDF files. Use when working with PDFs
  or when the user mentions forms or document extraction."]
# license: MIT
# compatibility: Requires uv and Python 3.11+
# metadata:
#   author: [your-org]
#   version: "1.0"
# allowed-tools: Bash Read
---

# [Skill Display Name]

[One-paragraph overview of what this skill does and why it exists.]

## Prerequisites

[List tools, packages, or environment setup the agent must verify before proceeding.
Remove this section if there are none.]

## Workflow

1. **[Step 1 title]**: [What to do.]
2. **[Step 2 title]**: [What to do.]
3. **[Step 3 title]**: [What to do.]

## Gotchas

[Non-obvious facts the agent would get wrong without being told. One bullet per gotcha.
Add a new entry every time you correct agent behavior during a run.
Remove this section if empty.]

- [Gotcha 1: what the agent would assume vs. what is actually true.]
- [Gotcha 2]

## Available Scripts

[Include only scripts that are deterministic, would be re-generated on every run without
a script, or require structured error handling. Remove if no scripts.]

- **`scripts/[name].[ext]`** — [What it does and when to run it.]

## References

[Progressive loading: content here is loaded on demand, not on every invocation.
List only files needed under specific conditions. Content needed on almost every run
should stay in SKILL.md above, not here. Remove if no references.]

- Read [references/[file].md](references/[file].md) when [condition].
