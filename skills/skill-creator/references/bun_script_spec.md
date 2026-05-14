# Bun Script Specification

Use this reference when writing or refactoring Bun scripts for the `scripts/` directory.

---

## Self-Contained Dependencies via Version-Pinned Imports

Bun auto-installs packages at runtime when it encounters version specifiers in import paths — no `package.json` or prior install step needed.

```typescript
import * as cheerio from "cheerio@1.0.0";
import { z } from "zod@3.22.0";
```

Pin the exact version in the import path. Without a version, Bun resolves against
the local `package.json`, which may not be present.

---

## Shebang

```typescript
#!/usr/bin/env bun
```

---

## Running Scripts

```bash
bun run scripts/extract.ts
```

TypeScript is supported natively — no compilation step.

```bash
bun scripts/extract.ts   # shorthand, also works
```

---

## Auto-Install Behavior

Bun's auto-install applies **only when no `node_modules` directory exists** anywhere in the directory tree (from the script's location up to the filesystem root).

| Condition | Bun behavior |
| --- | --- |
| No `node_modules` found in tree | Auto-installs packages to the global cache |
| `node_modules` found anywhere in tree | Falls back to standard Node.js resolution — auto-install is disabled |

In skills, keep scripts in `scripts/` without a sibling `package.json` or `node_modules` to reliably trigger auto-install.

---

## Global Package Cache

Packages are installed to a global Bun cache on first run. Subsequent runs are near-instant as long as the version specifier matches a cached entry.

---

## TypeScript Support

Bun runs `.ts` and `.tsx` files directly. A `tsconfig.json` is not required for basic scripts but may be added for type-checking or path aliases.

---

## Compatibility Notes

- Bun implements the Node.js API surface. Most npm packages work as-is.
- Packages with native addons (node-gyp) must be pre-built for the target platform. Check the package's documentation before including them.
- Bun does not support Deno's `jsr:` specifiers or permission flag system.

---

## Design Rules for Agentic Scripts

The same agentic design rules apply as for other languages:

- **No interactive prompts.** Use `process.argv` or `Bun.argv` for all input.
- **Implement `--help`.** Document all flags and include a usage example.
- **Send data to stdout, diagnostics to stderr.**
- **Use structured output** (JSON, CSV) for machine consumption.
- **Use meaningful exit codes.** `process.exit(code)` sets the exit code.

```typescript
if (!args.input) {
  console.error("Error: --input is required");
  process.exit(2);
}
```
