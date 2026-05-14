---
name: design-md-creator
description: >
  Use this skill when asked to create, update, or improve a DESIGN.md file, or when
  working on visual identity, design tokens, colors, typography, or UI component styles.
  Also trigger when a project has a docs/DESIGN.md that needs to be validated or changed
  before making UI-related edits. Trigger even if the user just says "design system",
  "brand colors", "update the palette", or "add component tokens".
---

# DESIGN.md Creator

This skill creates and maintains `DESIGN.md` files that follow the canonical
[@google/design.md](https://github.com/google-labs-code/design.md) specification: machine-readable
YAML design tokens (colors, typography, spacing, components) combined with structured
Markdown prose explaining the design rationale.

A well-formed `DESIGN.md` gives agents an exact, persistent understanding of a
project's visual identity — enabling consistent UI generation across sessions and tools.

## Core Principle

> Tokens are the normative values. Prose tells agents *why* those values exist
> and how to apply them.

## Workflow

### Step 1 — Check for Existing DESIGN.md

If a `DESIGN.md` or `docs/DESIGN.md` already exists:

1. If Node.js is available (`node --version`), run the linter: `npx @google/design.md lint DESIGN.md`
   and review findings before making changes (see Step 6 for severity priorities)
2. If Node.js is not available, manually verify the front matter structure against
   [references/token_schema.md](references/token_schema.md) and check for duplicate `##` headings
3. Diff against previous version if Node.js is available: `npx @google/design.md diff DESIGN-old.md DESIGN.md`
4. Proceed to apply the user's requested changes on top of the validated file

If no DESIGN.md exists, proceed to Step 2.

### Step 2 — Extract Design Intent

Before writing any tokens, gather:

- **Brand personality** — e.g., "editorial and precise", "warm and approachable", "technical and minimal"
- **Primary colors** — at least one; ideally 2–4 palette roles
- **Typography** — font families for headings vs. body vs. labels (if known)
- **Target audience** — affects density, contrast, font size choices
- **Tech stack** — affects export target (Tailwind v3/v4, DTCG, CSS custom properties)

If the user has not specified any of these, ask for brand personality and primary color
at minimum. Do not generate arbitrary tokens — token choices must be intentional.

### Step 3 — Choose Template

| Project Maturity | Template | When to Use |
| --- | --- | --- |
| Has full brand identity | [assets/design_template.md](assets/design_template.md) | Full color palette, defined typography, component needs |
| Early-stage / exploration | [assets/minimal_template.md](assets/minimal_template.md) | 1–2 colors, basic typography, no components yet |

### Step 4 — Write YAML Front Matter First

Generate the token block before writing prose. The YAML tokens are the normative values;
the prose derives from them. Order in the YAML front matter:

```yaml
---
version: alpha
name: [Design System Name]
description: [Optional one-line description]
colors:
  [token definitions]
typography:
  [token definitions]
rounded:
  [scale definitions]
spacing:
  [scale definitions]
components:
  [component token groups]
---
```

Read [references/token_schema.md](references/token_schema.md) for exact type definitions,
valid dimension units, and the token reference `{path.to.token}` syntax.

### Step 5 — Write Prose Sections

Write each applicable `##` section in the canonical order. Follow the section
guidance below. Sections may be omitted if not relevant, but present sections
**must** appear in canonical order.

Read [references/section_order.md](references/section_order.md) for per-section
prose requirements and examples.

**Mandatory sections:**

- `## Overview` — brand personality and emotional intent
- `## Colors` — rationale for each color token, including descriptive names

**Recommended sections (include when tokens exist):**

- `## Typography` — strategy for font families and type hierarchy
- `## Layout` — grid model, spacing philosophy
- `## Shapes` — corner radius philosophy

**Include if relevant:**

- `## Elevation & Depth` — shadow vs. tonal layering
- `## Components` — guidance for primary interactive elements
- `## Do's and Don'ts` — guardrails to prevent common misapplication

### Step 6 — Validate and Fix

If Node.js is available, run the linter and fix all findings:

```bash
npx @google/design.md lint DESIGN.md
```

Priority order for fixing:

1. `error` severity — `broken-ref`: a `{path.to.token}` reference points to nothing
2. `warning` severity — `contrast-ratio`: WCAG AA violation (< 4.5:1) on component token pairs
3. `warning` severity — `missing-primary`: add a `primary` color token
4. `warning` severity — `missing-typography`: add at least one typography token

Re-run lint after fixes until output shows `"errors": 0`.

If Node.js is **not** available, manually verify:

- No `{broken.reference}` tokens (every reference exists in the front matter)
- No duplicate `##` section headings
- All color values start with `#`
- Sections appear in canonical order (see [references/section_order.md](references/section_order.md))

### Step 7 — Export (if requested)

If the project uses Tailwind or needs DTCG tokens and Node.js is available, export:

```bash
# Tailwind v4 (CSS @theme block)
npx @google/design.md export --format css-tailwind DESIGN.md > theme.css

# Tailwind v3 (theme.extend JSON)
npx @google/design.md export --format json-tailwind DESIGN.md > tailwind.theme.json

# W3C DTCG tokens.json
npx @google/design.md export --format dtcg DESIGN.md > tokens.json
```

If Node.js is not available, the token values in the YAML front matter can be used
directly as the source of truth for manual integration.

## Gotchas

- **Duplicate `##` section headings are a hard error** — the linter will reject the file.
  Each section heading (`## Colors`, `## Typography`, etc.) must appear exactly once.
- **Token references must point to primitives** — `{colors.primary}` is valid;
  `{colors}` (pointing to a group) is not. Exception: inside `components`, referencing
  composite typography tokens like `{typography.body-md}` is permitted.
- **`fontWeight` accepts both number and quoted string** — `700` and `"700"` are both
  valid YAML. Do not add quotes unless the value would otherwise parse incorrectly.
- **Windows CLI caveat** — in `package.json` scripts, use `designmd` instead of
  `design.md` as the command name to avoid Windows file-association conflicts.
- **Color values must be hex with `#` prefix** — `"#1A1C1E"` is valid.
  Named colors (`red`), `rgb()`, or `hsl()` are not accepted as token values.
- **Section order is enforced** — the linter warns on `section-order` violations.
  Always write sections in canonical order even if some are empty or omitted.

## References

- Read [references/token_schema.md](references/token_schema.md) when writing or
  debugging YAML front matter tokens, token types, or `{reference}` syntax.
- Read [references/section_order.md](references/section_order.md) when writing
  prose sections or determining what content belongs in each `##` heading.
- Read [references/component_tokens.md](references/component_tokens.md) when
  defining component tokens, variants (hover/active/pressed), or valid component
  property names.
