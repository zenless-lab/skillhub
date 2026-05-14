---
version: alpha
name: [Design System Name]
description: [Optional: one-line description of the design system's personality]
colors:
  primary: "[#hex]"          # Core brand color — headlines, primary actions
  secondary: "[#hex]"        # Supporting color — borders, captions, metadata
  tertiary: "[#hex]"         # Accent — CTAs, highlights, interactive elements
  neutral: "[#hex]"          # Background / surface foundation
  # on-primary: "[#hex]"     # Text color on top of primary backgrounds
  # on-tertiary: "[#hex]"    # Text color on top of tertiary backgrounds
  # error: "[#hex]"          # Error state color
typography:
  h1:
    fontFamily: [Font Family]
    fontSize: [e.g., 3rem]
    fontWeight: [e.g., 700]
    lineHeight: [e.g., 1.1]
    letterSpacing: [e.g., -0.02em]
  h2:
    fontFamily: [Font Family]
    fontSize: [e.g., 2rem]
    fontWeight: [e.g., 600]
    lineHeight: [e.g., 1.2]
  body-md:
    fontFamily: [Font Family]
    fontSize: [e.g., 1rem]
    fontWeight: [e.g., 400]
    lineHeight: [e.g., 1.6]
  body-sm:
    fontFamily: [Font Family]
    fontSize: [e.g., 0.875rem]
    fontWeight: [e.g., 400]
    lineHeight: [e.g., 1.5]
  label-md:
    fontFamily: [Font Family]
    fontSize: [e.g., 0.75rem]
    fontWeight: [e.g., 500]
    lineHeight: [e.g., 1]
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 16px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
  xl: 64px
  gutter: 24px
components:
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    rounded: "{rounded.md}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: 12px
  input:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: 8px
---

## Overview

[Describe the brand personality and design intent in 2–4 sentences. Answer:
What emotional response should the UI evoke? What aesthetic archetype does it follow
(minimalist, editorial, playful, technical)? What makes this design system unique?
Example: "Architectural Minimalism meets Journalistic Gravitas. The palette evokes
a premium printed publication — high contrast, intentional whitespace, a single
earthy accent for interaction."]

## Colors

[Explain the rationale for each color. Use descriptive names alongside hex values.
Describe the role each color plays in the UI.]

- **Primary ([hex]):** [Descriptive name] — [Role in the UI, e.g., "Core text and headlines"]
- **Secondary ([hex]):** [Descriptive name] — [Role, e.g., "Borders, captions, metadata"]
- **Tertiary ([hex]):** [Descriptive name] — [Role, e.g., "Sole interaction driver: CTAs and highlights"]
- **Neutral ([hex]):** [Descriptive name] — [Role, e.g., "Page background, surface foundation"]

## Typography

[Describe the typographic strategy. Which font families are used and why? How does
the type hierarchy serve the brand personality?]

- **Headings ([h1]/[h2]):** [Font family] — [Why this choice, e.g., "High-contrast grotesque for authority"]
- **Body ([body-md]):** [Font family] — [Why, e.g., "Optimized for long-form reading at 16px"]
- **Labels ([label-md]):** [Font family or description] — [Role, e.g., "Technical metadata, timestamps"]

## Layout

[Describe the layout model: grid type (fluid / fixed / CSS grid), max width,
and the spacing scale philosophy.]

The layout follows a [fluid/fixed-max-width] grid model.

A [base unit, e.g., 8px] spacing scale is used throughout. Spacing tokens:
`xs` (4px), `sm` (8px), `md` (16px), `lg` (32px), `xl` (64px).

[Additional notes: gutters, safe areas, container padding, column counts.]

## Elevation & Depth

[Describe how visual hierarchy is communicated: shadows, tonal layering, borders,
or contrast. For flat designs, explain the alternative method.]

[Example: "Depth is expressed through tonal layering rather than drop shadows.
Primary content sits on white cards; the page background uses the neutral foundation."]

## Shapes

[Describe the corner radius philosophy and what it communicates about the brand.]

[Example: "Architectural sharpness: 4px radius on all interactive elements — just
enough softness for modernity while maintaining an engineered aesthetic."]

## Components

[Provide style guidance for key interactive elements. Reference token values where possible.]

**Primary Button:** [backgroundColor], [textColor], [rounded], [padding]. Used exclusively
for the primary action per screen.

**Secondary Button:** Outline style, [textColor] text on transparent background.
Used for secondary actions where the primary action already exists on the page.

**Input Fields:** [backgroundColor] fill, [textColor] text, [rounded] corners.
Error state: [describe error visual treatment].

## Do's and Don'ts

- Do use the primary color only for the single most important action per screen
- Do maintain WCAG AA contrast ratios (4.5:1 minimum for normal text)
- Don't mix rounded and sharp corner styles in the same view
- Don't use more than two font weights on a single screen
- [Add project-specific guardrails]
