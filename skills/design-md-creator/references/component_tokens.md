# Component Tokens Reference

This document defines the valid component property names, value types, and variant
patterns for the `components` section of a DESIGN.md front matter.

## Component Token Structure

```yaml
components:
  <component-name>:
    <property>: <value-or-reference>
```

Each `<component-name>` is a string identifier. Names should use kebab-case.
Each `<property>` maps to a design token type.

## Valid Component Properties

| Property | Type | Example |
| --- | --- | --- |
| `backgroundColor` | Color or Token Reference | `"#1A1C1E"` or `"{colors.primary}"` |
| `textColor` | Color or Token Reference | `"#ffffff"` or `"{colors.on-primary}"` |
| `typography` | Token Reference (composite allowed) | `"{typography.label-md}"` |
| `rounded` | Dimension or Token Reference | `8px` or `"{rounded.md}"` |
| `padding` | Dimension or Token Reference | `12px` or `"{spacing.sm}"` |
| `size` | Dimension | `40px` |
| `height` | Dimension | `48px` |
| `width` | Dimension | `200px` |

**Unknown properties** (e.g., `borderColor`, `opacity`) are accepted with a linter
warning but not an error. Include them if needed for your application.

## Variant Pattern

Variants (hover, active, disabled, pressed, etc.) are expressed as **separate component
entries** with a related key name. There is no nested `variants:` block.

```yaml
components:
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    rounded: "{rounded.md}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.tertiary-container}"
    textColor: "{colors.on-tertiary}"
  button-primary-disabled:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.secondary}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: 12px
  button-secondary-hover:
    backgroundColor: "{colors.neutral}"
```

**Naming convention for variants:** `[component-name]-[state]`

Common state suffixes: `-hover`, `-active`, `-pressed`, `-disabled`, `-focus`,
`-error`, `-selected`

## Token Reference Rules in Components

Unlike other token groups, `components` **allows references to composite Typography tokens**:

```yaml
components:
  input:
    typography: "{typography.body-md}"    # valid — composite reference inside components
    backgroundColor: "{colors.neutral}"
    rounded: "{rounded.sm}"
```

Outside `components`, references must point to primitive values only.

## Contrast Ratio Requirement

The linter checks `backgroundColor` / `textColor` pairs for WCAG AA compliance:

- **Normal text** (< 18pt / 14pt bold): minimum contrast ratio **4.5:1**
- **Large text** (≥ 18pt / 14pt bold): minimum contrast ratio **3:1**

A `contrast-ratio` warning is emitted for failing pairs. Fix by adjusting one
of the color values to meet the threshold.

Check computed contrast ratio with the linter (requires Node.js):

```bash
npx @google/design.md lint DESIGN.md
```

The output will include the ratio for any failing pair:

```json
{
  "severity": "warning",
  "path": "components.button-primary",
  "message": "textColor (#ffffff) on backgroundColor (#1A1C1E) has contrast ratio 15.42:1 — passes WCAG AA."
}
```

## Recommended Components to Define

The following are common components to specify. Not all are required:

| Component | Typical Properties | Notes |
| --- | --- | --- |
| `button-primary` | `backgroundColor`, `textColor`, `rounded`, `padding` | Define hover/disabled variants |
| `button-secondary` | `backgroundColor`, `textColor`, `rounded`, `padding` | Often transparent background |
| `button-tertiary` | `textColor`, `padding` | Text-only button |
| `input` | `backgroundColor`, `textColor`, `rounded`, `padding` | Add `-error` variant |
| `card` | `backgroundColor`, `rounded` | |
| `chip` | `backgroundColor`, `textColor`, `rounded`, `padding` | |
| `tooltip` | `backgroundColor`, `textColor`, `rounded`, `padding` | |
| `badge` | `backgroundColor`, `textColor`, `rounded`, `padding` | |
