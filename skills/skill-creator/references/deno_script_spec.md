# Deno Script Specification

Use this reference when writing or refactoring Deno scripts for the `scripts/` directory.

---

## Self-Contained Imports

Deno resolves dependencies directly from import specifiers — no `package.json` or install step required.

```typescript
import * as cheerio from "npm:cheerio@1.0.0";
import { z } from "npm:zod@3.22.0";
import { assertEquals } from "jsr:@std/assert@0.226.0";
```

| Prefix | Registry |
| --- | --- |
| `npm:` | npm registry |
| `jsr:` | JSR (Deno-native packages) |

### Version Pinning

Always pin exact versions in import specifiers:

```typescript
// Exact pin (recommended for skills)
import { load } from "npm:cheerio@1.0.0";

// Compatible range
import { load } from "npm:cheerio@^1.0.0";
```

Unpinned imports (e.g. `npm:cheerio`) resolve to whatever is latest at runtime and should be avoided.

---

## Shebang

Add a shebang so the script is directly executable:

```typescript
#!/usr/bin/env -S deno run
```

To embed permissions in the shebang:

```typescript
#!/usr/bin/env -S deno run --allow-read --allow-net
```

The `-S` flag tells `env` to split the remainder as multiple arguments.

---

## Running Scripts

```bash
deno run scripts/extract.ts
```

With explicit permissions:

```bash
deno run --allow-read --allow-net scripts/extract.ts
```

---

## Permission Flags

Deno is deny-by-default. Every external resource access requires an explicit flag.

| Flag | Grants access to |
| --- | --- |
| `--allow-read[=path]` | Filesystem reads (optionally scoped to a path) |
| `--allow-write[=path]` | Filesystem writes |
| `--allow-net[=host]` | Network (optionally scoped to a hostname) |
| `--allow-env[=var]` | Environment variables |
| `--allow-run[=cmd]` | Subprocess execution |
| `--allow-all` / `-A` | All permissions — avoid in skills |

Prefer scoped permissions over broad ones. Document required flags in `SKILL.md` and in `--help` output.

Use `--` to separate Deno flags from the script's own flags when both sets have overlapping syntax:

```bash
deno run --allow-read scripts/lint.ts -- --fix .
```

---

## Import Maps (Optional)

For scripts with many shared imports, an import map centralizes version pinning:

```json
{
  "imports": {
    "cheerio": "npm:cheerio@1.0.0"
  }
}
```

```bash
deno run --import-map=import_map.json scripts/extract.ts
```

---

## Dependency Caching

Deno caches dependencies globally on first run. Subsequent runs are near-instant.

Force a re-fetch:

```bash
deno run --reload scripts/extract.ts
```

---

## Packages with Native Addons

Packages that require node-gyp (native bindings compiled at install time) typically do not work under Deno. Prefer packages that ship pre-built binaries or are pure JavaScript/TypeScript.

---

## Design Rules for Agentic Scripts

The same agentic design rules apply as for other languages:

- **No interactive prompts.** Deno scripts run in non-interactive environments.
- **Implement `--help`.** Use `deno run scripts/tool.ts --help` as the discovery path.
- **Send data to stdout, diagnostics to stderr.**
- **Use structured output** (JSON, CSV) for machine consumption.
- **Use meaningful exit codes.** `Deno.exit(code)` sets the process exit code.

```typescript
if (!args.input) {
  console.error("Error: --input is required");
  Deno.exit(2);
}
```
