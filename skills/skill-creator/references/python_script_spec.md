# Python Script Specification

Use this reference when writing or refactoring Python scripts for the `scripts/` directory.

---

## Inline Dependency Declaration (PEP 723)

Scripts must declare dependencies inline using [PEP 723](https://peps.python.org/pep-0723/) script metadata. This makes the script fully self-contained — no `requirements.txt`, no prior install step.

```python
# /// script
# dependencies = [
#   "httpx>=0.27,<1",
#   "beautifulsoup4>=4.12",
# ]
# requires-python = ">=3.11"
# ///
```

Place this block near the top of the file, before any imports.

### Version Pinning

Use [PEP 508](https://peps.python.org/pep-0508/) specifiers:

| Style | Meaning |
| --- | --- |
| `"package==1.2.3"` | Exact pin |
| `"package>=1.2,<2"` | Compatible range (preferred for libraries) |
| `"package"` | Latest — avoid in skills |

Prefer `>=X.Y,<X+1` for library dependencies, exact pins for tools.

---

## Running Scripts

### Recommended: `uv run`

```bash
uv run scripts/extract.py
```

`uv run` creates an isolated virtual environment, installs declared dependencies, and runs the script. Subsequent runs reuse the cached environment.

### Alternative: `pipx run`

```bash
pipx run scripts/extract.py
```

`pipx` also supports PEP 723 and is available via OS package managers.

---

## Lockfiles (Full Reproducibility)

To freeze the complete dependency graph:

```bash
uv lock --script scripts/extract.py
```

This creates `scripts/extract.py.lock`. Commit it alongside the script when exact reproducibility is required.

---

## Design Rules for Agentic Scripts

### No Interactive Prompts

Scripts run in non-interactive shells. Never use `input()`, password prompts, or confirmation menus — the script will hang indefinitely.

Accept all input via command-line arguments, environment variables, or stdin.

```python
# Bad: hangs in agentic execution
target = input("Enter target: ")

# Good: fail fast with a clear error
import argparse
parser = argparse.ArgumentParser()
parser.add_argument("--target", required=True, help="Target to process")
args = parser.parse_args()
```

### `--help` Output

Always implement `--help`. This is the primary way an agent learns the script's interface.

Include: a one-line description, all flags with types and defaults, and at least one usage example.

### Helpful Error Messages

Write error messages for the agent, not a human at a terminal:

```python
# Bad
raise ValueError("invalid input")

# Good
parser.error(
    f"--format must be one of: json, csv, table. Received: {args.format!r}"
)
```

### Structured Output

Send data to stdout in a machine-readable format (JSON, CSV, TSV). Send progress and diagnostics to stderr.

```python
import json, sys

result = {"status": "ok", "count": 42}
print(json.dumps(result))                    # stdout: parseable data
print("Processing...", file=sys.stderr)      # stderr: diagnostics
```

### Exit Codes

| Code | Meaning |
| --- | --- |
| `0` | Success |
| `1` | General error |
| `2` | Invalid arguments |
| `3+` | Domain-specific errors (document them in `--help`) |

### Idempotency

Design operations to be safely re-runnable. Agents may retry on transient failures.

### Large Output

If output may exceed ~10,000 characters, default to a summary and provide `--full` or `--output FILE` flags. Many agent harnesses truncate stdout silently.
