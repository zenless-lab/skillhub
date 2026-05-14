# DESIGN.md Token Schema Reference

This document defines the complete YAML front matter schema for `DESIGN.md` files,
following the `@google/design.md` specification (version: alpha).

## Full Schema

```yaml
version: <string>          # Optional. Current value: "alpha"
name: <string>             # Required. Design system name
description: <string>      # Optional. One-line description
colors:
  <token-name>: <Color>
typography:
  <token-name>: <Typography>
rounded:
  <scale-level>: <Dimension>
spacing:
  <scale-level>: <Dimension | number>
components:
  <component-name>:
    <property-name>: <string | token-reference>
```

## Token Types

| Type | Format | Valid Examples | Invalid |
| --- | --- | --- | --- |
| Color | `#` + 3 or 6 hex chars (sRGB) | `"#1A1C1E"`, `"#fff"` | `rgb(...)`, `hsl(...)`, named colors |
| Dimension | number + unit (`px`, `em`, `rem`) | `48px`, `1.5rem`, `-0.02em` | `48`, `1.5` (no unit) |
| Token Reference | `{path.to.token}` | `{colors.primary}`, `{rounded.md}` | `{colors}` (group, not primitive) |
| Typography | Object (see below) | See Typography Object section | |
| Unitless Number | Plain number | `1.6`, `400`, `700` | — |

## Color Tokens

```yaml
colors:
  primary: "#1A1C1E"
  secondary: "#6C7278"
  tertiary: "#B8422E"
  neutral: "#F7F5F2"
```

**Recommended token names (non-normative):**
`primary`, `secondary`, `tertiary`, `neutral`, `surface`, `on-surface`,
`on-primary`, `on-secondary`, `on-tertiary`, `error`

## Typography Object

All fields are optional except `fontFamily` and `fontSize`:

```yaml
typography:
  body-md:
    fontFamily: Public Sans          # string (font name, may include spaces)
    fontSize: 16px                   # Dimension
    fontWeight: 400                  # number OR quoted string — both valid
    lineHeight: 1.6                  # Dimension (e.g., 24px) OR unitless number (1.6)
    letterSpacing: 0.01em            # Dimension
    fontFeature: "kern liga"         # string — CSS font-feature-settings value
    fontVariation: "'wght' 400"      # string — CSS font-variation-settings value
```

**`fontWeight` note:** In YAML, bare `400` and quoted `"400"` are equivalent.
Do not worry about quoting — both parse correctly.

**`lineHeight` note:** A unitless number (e.g., `1.6`) means "1.6× the element's
font size" — this is the recommended CSS practice. A dimension (e.g., `24px`)
sets an absolute line height.

**Recommended typography token names (non-normative):**
`display`, `headline-lg`, `headline-md`, `headline-sm`,
`body-lg`, `body-md`, `body-sm`, `label-lg`, `label-md`, `label-sm`, `caption`

## Rounded Tokens

```yaml
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 16px
  xl: 24px
  full: 9999px
```

**Recommended scale names (non-normative):** `none`, `xs`, `sm`, `md`, `lg`, `xl`, `full`

## Spacing Tokens

```yaml
spacing:
  base: 16px           # Dimension
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
  xl: 64px
  gutter: 24px
  grid-columns: "12"   # Unitless string (column count)
```

**Scale names (`<scale-level>`):** Any descriptive string key is valid.
Common names: `xs`, `sm`, `md`, `lg`, `xl`, `xxl`, `gutter`, `margin`, `base`.

## Token References

Cross-reference other defined tokens using the `{path.to.token}` syntax:

```yaml
components:
  button-primary:
    backgroundColor: "{colors.tertiary}"    # resolves to colors.tertiary value
    textColor: "{colors.on-tertiary}"
    rounded: "{rounded.md}"
    typography: "{typography.label-md}"     # composite ref allowed in components
    padding: 12px                           # literal dimension value
```

**Rules:**

- Outside `components`: references must point to a **primitive** value (Color, Dimension,
  number) — not a group (e.g., `{colors}` is invalid)
- Inside `components`: references to composite values (`{typography.body-md}`) are
  permitted
- A broken reference (pointing to a non-existent token) produces a `broken-ref` error
from the linter — if Node.js is available: `npx @google/design.md lint DESIGN.md`

## Encoding Rules

- The YAML front matter block must begin and end with a line containing exactly `---`
- The front matter must appear at the very top of the file (no content before the
  opening `---`)
- Duplicate keys within the same level are not permitted
- Unknown token names (e.g., a color named `brand-forest`) are accepted without error
- Unknown token types in `components` are accepted with a warning (not an error)
