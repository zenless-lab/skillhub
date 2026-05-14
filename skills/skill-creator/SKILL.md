---
name: skill-creator
description: >
  Build and improve Agent Skills following spec-compliant structure and effective
  instruction patterns. Use when asked to create, scaffold, refactor, or fix a
  skill — including writing descriptions, adding scripts, organizing reference
  files, or updating gotchas — even if the user just says "make a skill for X",
  "write a skill", or "clean up this skill".
---

# Skill Creator

This skill guides you through building a well-structured, high-quality Agent Skill from scratch — covering both spec compliance and the practices that make a skill effective in production.

If available, use the skills-spec MCP server for documentation lookup; it is recommended but not required.

## Core Principles

Apply these throughout the entire creation process, not just at a single step.

- **Ground in real expertise.** Do not generate skill content from LLM training knowledge alone. Complete the real task first or synthesize from actual artifacts: internal runbooks, API specs, code review comments, git diffs and patches, incident reports. Project-specific material dramatically outperforms generic best-practice articles.
- **Add what the agent lacks; omit what it knows.** Write about project-specific conventions, domain-specific procedures, non-obvious edge cases, and which exact tools or APIs to use. Skip explanations of what a CSV is, how HTTP works, or what a database migration does.
- **Scope coherently.** A skill should encapsulate one coherent unit of work. Too narrow forces multiple skills to load simultaneously and risks conflicting instructions. Too broad makes precise triggering unreliable. A skill that queries a database and formats results is likely one unit; a skill that also covers database administration is probably two.
- **Calibrate specificity to fragility.** Be prescriptive when an operation is fragile, must happen in a specific sequence, or consistency is critical. Give the agent freedom when multiple valid approaches exist — in those cases, explaining *why* is more useful than rigid step-by-step directives.
- **Procedures over declarations.** Teach the agent how to *approach* a class of problems, not what to produce for a specific instance. The approach should generalize even when individual details are specific.
- **One default, brief fallback.** When multiple tools or approaches could work, choose one as the default and mention alternatives in a single sentence. Do not present equal options — agents presented with menus make inconsistent choices.
- **Moderate detail wins.** Overly comprehensive skills hurt more than they help. An agent with exhaustive instructions may pursue unproductive paths triggered by clauses that don't apply to the current task. Concise, stepwise guidance with a working example consistently outperforms exhaustive documentation.

## Instruction Patterns

Use these patterns when writing the body of any `SKILL.md`. Not every skill needs all of them.

**Gotchas** — The highest-value content. List only facts the agent would get wrong based on reasonable assumptions: naming inconsistencies across systems, soft deletes, endpoints that lie, required flags that aren't obvious. Add a new gotcha every time the agent makes a mistake you correct. Do *not* include general advice ("handle errors appropriately"); that belongs in procedure steps.

**Output format templates** — Provide a concrete template rather than describing the format in prose. Agents pattern-match well against concrete structures. Short templates belong inline; long or conditionally needed templates belong in `assets/` with a conditional load instruction pointing to them.

**Checklists** — Useful for multi-step workflows where steps have dependencies or validation gates. An explicit checklist helps the agent track progress and avoid skipping steps.

**Validation loops** — Instruct the agent to validate its own work before moving on: do the work, run a validator (a script, a reference checklist, or a self-check against a spec), fix any issues, and repeat until validation passes. A script that produces a clear error message ("Field 'x' not found — available: a, b, c") gives the agent enough to self-correct without a round-trip.

**Plan-validate-execute** — For batch or destructive operations: produce an intermediate plan as a structured file, validate it against a source of truth (schema, list of valid names, etc.), then execute. Never skip the validation step — it is what enables autonomous self-correction.

**Script bundling** — If the same logic would need to be re-generated on every invocation without a script (chart generation, a specific format parser, output validation), extract it into a tested script in `scripts/` and instruct the agent to use it.

## Workflow

### Phase 1: Define the Skill

Before creating any files:

1. Determine **what the skill does** — the task or domain it covers.
2. Determine **when to trigger it** — the user intents and phrasing that should activate it, including indirect phrasings that don't name the domain.
3. Identify **what knowledge the agent lacks** that makes this skill necessary. If the agent already handles the task well without a skill, the skill adds no value.
4. Decide **what content to include**: executable scripts, reference files, or instructions only.

If synthesizing from existing material, prefer: internal documentation, API specs and schemas, real code review comments, git patch history (not just commit messages), and actual failure cases with their resolutions.

### Phase 2: Plan the Structure

```text
<skill-name>/
├── SKILL.md
├── scripts/        (only if executable logic is needed)
├── references/     (only if detailed reference material is needed)
└── assets/         (only if templates or static resources are needed)
```

Only create subdirectories that will contain at least one file.

Verify the skill name before creating the directory:

- Lowercase `a-z`, digits `0-9`, hyphens `-` only
- No leading, trailing, or consecutive hyphens (`--`)
- Max 64 characters
- Must exactly match the parent directory name

Load [references/spec_hard_rules.md](references/spec_hard_rules.md) if any constraint is unclear.

### Phase 3: Write `SKILL.md`

Use [assets/skill_template.md](assets/skill_template.md) as the starting point.

**Frontmatter checklist:**

- [ ] `name` matches the directory name exactly and passes naming rules
- [ ] `description` is 1–1024 characters — see guidance below
- [ ] `compatibility` included only if the skill has specific environment requirements (≤ 500 chars)
- [ ] `license` included if distributing the skill publicly
- [ ] `allowed-tools` included only if the skill requires specific tool permissions (experimental; support varies by runtime)
- [ ] `metadata` included only if distributing or versioning the skill; use unique key names to avoid conflicts

**Writing the `description`:**

- Use imperative phrasing: "Use when..." not "This skill does..."
- Focus on trigger conditions and user intent — not what the skill contains or how it works
- Keep it short; avoid listing internal components (scripts, templates, reference files)
- Cover indirect phrasings: "even if the user doesn't explicitly say 'X'"
- Stay under 1024 characters — prioritize brevity over completeness

**Good description:**

```text
Extract text and tables from PDF files, fill forms, and merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
```

**Poor description:**

```text
Helps with documents.
```

The poor example gives the agent no way to distinguish this from other document-related skills.

**Writing the body:**

- Write step-by-step workflow instructions, not a feature list
- Include a **Gotchas** section (see Instruction Patterns above) — this is the highest-value content
- Tell the agent *when* to load each reference file, not just that files exist
- Keep the body under 500 lines; move detailed material to `references/`

### Phase 4: Review with User

Present the drafted `SKILL.md` to the user before creating any additional files:

1. Show the full draft and ask:
   - Does this cover your use cases?
   - Is anything unclear or missing?
   - Are any sections too detailed or not detailed enough?
2. Incorporate the feedback.
3. Get explicit approval before proceeding to Phase 5.

### Phase 5: Add Scripts (if needed)

**Add scripts only when at least one of the following applies:**

- The operation is deterministic and would produce identical code on every run (validation, parsing, formatting).
- The same logic would need to be re-generated on every invocation without a script.
- Errors need structured, explicit handling that inline code generation cannot reliably provide.

When in doubt, generate code inline first — extract to a script only after the pattern repeats across multiple runs.

Copy the matching template from `assets/` and replace the placeholder logic:

| Language | Template | Run command |
| --- | --- | --- |
| Python | `assets/uv_script_template.py` | `uv run scripts/<name>.py` |
| Deno | `assets/deno_script_template.ts` | `deno run [--flags] scripts/<name>.ts` |
| Bun | `assets/bun_script_template.ts` | `bun run scripts/<name>.ts` |
| Ruby | `assets/ruby_script_template.rb` | `ruby scripts/<name>.rb` |

Load the language-specific reference for dependency declaration and version pinning:
[python_script_spec.md](references/python_script_spec.md) · [deno_script_spec.md](references/deno_script_spec.md) · [bun_script_spec.md](references/bun_script_spec.md) · [ruby_script_spec.md](references/ruby_script_spec.md)

All scripts must follow these universal rules regardless of language:

- **No interactive prompts** — agents run in non-interactive shells; any TTY prompt causes an indefinite hang
- **`--help` output** — this is the primary interface discovery mechanism for the agent
- **Data to stdout, diagnostics to stderr** — structured output (JSON preferred) enables downstream composability
- **Meaningful exit codes** — 0 success, 2 bad arguments, 1 general error; document non-standard codes in `--help`
- **Idempotent by default** — agents may retry; "create if not exists" is safer than "fail on duplicate"

### Phase 6: Add Assets (if needed)

Assets go in `assets/`. Use this directory for output format templates or static resources that are too long or too conditional to embed directly in `SKILL.md`.

**Add an asset file when:**

- An output format template exceeds ~20 lines — short templates belong inline.
- A template is only needed under specific conditions and should not load on every invocation.
- A static resource (config scaffold, starter file) is referenced at runtime.

In `SKILL.md`, reference asset files with a conditional load instruction:

```markdown
- Load [assets/report_template.md](assets/report_template.md) when generating a report.
```

### Phase 7: Add Reference Files (if needed)

Skills use progressive loading: `SKILL.md` is read on every invocation, but reference files are loaded on demand. This distinction drives where content belongs.

**Keep in `SKILL.md`:** Steps and facts needed on almost every run — including Gotchas.

**Move to `references/`:** Content needed only under specific conditions — API error codes, schema definitions, advanced features, large reference tables, rarely used edge cases. Over-splitting is also wasteful: loading a reference file has its own token cost, so do not extract content that would be needed on nearly every run anyway.

Reference files go in `references/`. Keep each file focused on one topic.

In `SKILL.md`, add *conditional* load instructions. Specify the trigger condition, not just the file name:

```markdown
- Read [references/api-errors.md](references/api-errors.md) if the API returns a non-200 status.
- Read [references/schema.md](references/schema.md) when constructing or validating data models.
```

Generic "see references/ for details" instructions are not useful — the agent needs to know *when* to load each file.

### Phase 8: Validate

Before delivering the skill:

**Spec compliance:**

- [ ] `name` in frontmatter matches the directory name exactly
- [ ] `description` is 1–1024 characters and uses imperative phrasing
- [ ] `compatibility` is ≤ 500 characters (if present)
- [ ] `allowed-tools` and `metadata` are removed unless intentionally needed — do not leave in from template
- [ ] All file references in `SKILL.md` use relative paths from the skill root
- [ ] No reference file is loaded unconditionally without a trigger condition
- [ ] All scripts implement `--help` and accept all input via flags (never interactive prompts)
- [ ] `SKILL.md` body is under 500 lines

**Trigger quality:**

- [ ] `description` covers indirect phrasings — not only the explicit domain name
- [ ] `description` is specific enough to not activate for unrelated tasks
- [ ] The skill covers one coherent unit of work (not too broad, not too narrow)

**Content quality:**

- [ ] `Gotchas` contains only domain-specific, non-obvious facts — no general advice
- [ ] Workflow steps are action-oriented ("do X"), not declarative ("X is important")
- [ ] Everything in `SKILL.md` is needed on most runs; optional content is in `references/`
- [ ] Each reference file load instruction specifies a precise condition, not "see references/"

### Phase 9: Refine After Execution

A skill's first draft almost always needs iteration. Run the skill against real tasks, then revise.

**Read execution traces, not just final outputs.** If the agent wastes turns trying multiple approaches before succeeding, the instructions are too vague. If the agent follows instructions that don't apply to the current task, the scope is too broad.

**Update Gotchas immediately.** Every time you correct the agent's behavior during a run, add the correction to the Gotchas section. This is the highest-ROI improvement to a skill.

**Evaluate description trigger rate.** Design a small set of test queries (8–10 that should trigger, 8–10 that should not). Run each against the skill several times and check whether the agent activates it. If should-trigger queries are failing, the description is too narrow. If should-not-trigger queries false-trigger, the description is too broad. Revise by addressing the *category* the failing queries represent, not by adding the specific keywords from those queries.

## Documentation Lookup

If you need to verify a spec constraint or format detail, use the `skills-spec` MCP server. Load [references/mcp_access_guide.md](references/mcp_access_guide.md) for setup instructions and the two-step search workflow.
