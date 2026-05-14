# DESIGN.md Section Order and Prose Guidelines

This document defines the canonical section order for `DESIGN.md` files and provides
guidance on what content belongs in each section's prose.

## Canonical Section Order

Sections use `##` headings. Sections not needed may be omitted, but those present
**must appear in this order**. The linter warns on `section-order` violations.

| # | Section Heading | Aliases Accepted |
| --- | --- | --- |
| 1 | `## Overview` | `## Brand & Style` |
| 2 | `## Colors` | — |
| 3 | `## Typography` | — |
| 4 | `## Layout` | `## Layout & Spacing` |
| 5 | `## Elevation & Depth` | `## Elevation` |
| 6 | `## Shapes` | — |
| 7 | `## Components` | — |
| 8 | `## Do's and Don'ts` | — |

An optional `# h1` title may appear before the first `##` section for document titling.
It is not parsed as a section.

---

## Section Guidance

### `## Overview` (also: `## Brand & Style`)

**Purpose:** Foundational context that guides all stylistic decisions not covered by
explicit tokens. Defines the brand personality, target audience, and the emotional
response the UI should evoke.

**Write:**

- The aesthetic archetype (e.g., "editorial minimalism", "warm and approachable", "clinical precision")
- The emotional register (e.g., "trustworthy and institutional", "playful and accessible")
- Any analogy that captures the feel (e.g., "a premium broadsheet", "a Bauhaus poster")
- Key constraints (high-traffic, data-dense, accessibility-critical)

**Do not write:** Technical implementation details. Those belong in later sections.

**Example:**

```markdown
## Overview

Architectural Minimalism meets Journalistic Gravitas. The UI evokes a premium
matte publication — precise, intentional, with a single earthy accent driving all
interaction. Designed for readers who value clarity over decoration.
```

---

### `## Colors`

**Purpose:** Explains the color palette rationale. Each token should be named
and described with its semantic role in the UI.

**Write:**

- A brief description of the palette philosophy (high-contrast, warm, monochromatic, etc.)
- For each color token: hex value, descriptive name, and the specific role it plays
- How colors relate to each other (which ones pair, which compete, etc.)

**Example:**

```markdown
## Colors

Rooted in high-contrast neutrals with a single evocative accent.

- **Primary (#1A1C1E):** Deep Ink — headlines, core text, maximum readability.
- **Secondary (#6C7278):** Sophisticated Slate — borders, captions, metadata.
- **Tertiary (#B8422E):** Boston Clay — the sole driver for interaction and highlights.
- **Neutral (#F7F5F2):** Warm Limestone — page foundation, softer than pure white.
```

---

### `## Typography`

**Purpose:** Defines the typographic strategy: which font families are used, why they
were chosen, and how the type scale serves the brand personality.

**Write:**

- Font family rationale (why these fonts, what personality they convey)
- How the type hierarchy works (headline vs. body vs. label roles)
- Any special usage rules (e.g., "labels are always uppercase with letter-spacing")

**Example:**

```markdown
## Typography

Two typefaces: Public Sans for narrative, Space Grotesk for technical data.

- **Headlines (h1, h2):** Public Sans Semi-Bold — institutional voice, readable at large sizes.
- **Body (body-md):** Public Sans Regular at 16px — contemporary, long-form readable.
- **Labels (label-md):** Space Grotesk, uppercase with generous letter-spacing — precision
  for timestamps, metadata, technical values.
```

---

### `## Layout` (also: `## Layout & Spacing`)

**Purpose:** Describes the layout model and spacing philosophy. Ties the spacing tokens
to the grid system.

**Write:**

- Grid type: fluid column grid, fixed-max-width grid, or custom (e.g., Liquid Glass)
- Max content width (if fixed)
- Base spacing unit and scale rationale (e.g., "8px base unit for consistent rhythm")
- Specific layout patterns (card containment, sidebar, breakpoints)

---

### `## Elevation & Depth`

**Purpose:** Explains how visual hierarchy is expressed. For shadow-based designs:
defines layer levels. For flat designs: explains the alternative (tonal layers, borders,
color contrast).

**Write:**

- Primary mechanism: drop shadows, tonal differentiation, borders, none
- If shadows: spread, blur, opacity, color per elevation level
- If tonal: describe the background/surface/card color relationships

---

### `## Shapes`

**Purpose:** Describes the corner radius philosophy and what it communicates
about the brand.

**Write:**

- Core radius value and why (sharp = engineered; round = approachable)
- Which elements get which radius scale (buttons, cards, inputs, chips)
- Consistency rules (e.g., "never mix rounded and sharp in the same view")

---

### `## Components`

**Purpose:** Style guidance for common UI atoms. Prose complements the YAML component
tokens by explaining application rules and edge cases.

**Write:**

- Which variants exist and when to use each (primary vs. secondary button)
- State descriptions (hover, active, disabled, error) not fully captured by tokens
- Sizing and density guidance

**Do not write:** Exhaustive documentation for every edge case. Keep it scannable.

---

### `## Do's and Don'ts`

**Purpose:** Practical guardrails that prevent common misapplication of the design system.

**Write:** Short, imperative rules. Use "Do" and "Don't" (or "Avoid") framing.

**Include:**

- Color usage limits (e.g., "use tertiary only for primary action per screen")
- Contrast requirements (always mention WCAG AA minimum)
- Typography restrictions (max font weights per screen)
- Consistency rules that span sections (corner radius mixing, etc.)
