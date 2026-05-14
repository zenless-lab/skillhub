---
name: secret-guard
description: >
  Use this skill to scan files, git changes, commits, or pull requests for
  secrets, credentials, and sensitive key material. Trigger this skill when the
  user asks to check for API keys, tokens, passwords, private keys, database
  credentials, cloud access keys, or other secrets. Also use for pre-commit
  security checks, submission-time audits, or when asked to "check if anything
  sensitive was committed", "scan for hardcoded secrets", "review credentials
  before push", or "audit for leaked tokens". Trigger even if the user just says
  "make sure nothing secret is in this file". Honors repository .gitleaks.toml
  policy when present.
---

# Secret Guard

Use this skill to detect secrets, credentials, and sensitive key material in
code, configuration, infrastructure files, and git history. Combine
detect-secrets-based automated scanning with semantic judgment, and declare the
audit boundary before any scan starts.

## Core Rules

1. Declare the audit boundary first. State the scope type and resolved files before scanning.
2. Check early whether `.gitleaks.toml` or a similar policy file exists. Honor its allowlists and ignore rules before running detectors.
3. Check whether `.pre-commit-config.yaml` exists with relevant secret-scanning hooks.
4. Choose scan depth from the change summary. Do not default to full semantic review for generated, third-party, or oversized changes.
5. Report precise findings and keep likely false positives separate.

## Scope Types

Supported scope types:

- Git: `staged`, `changed`, `commit <hash>`, `pr <id>`
- Filesystem: `entire repo`, `directory`, `specific file`

Load [references/scope_discovery.md](references/scope_discovery.md) when you need the concrete git or filesystem commands to resolve the boundary.

## Policy File Check

Before scanning, check for repository-level policy files:

```bash
ls .gitleaks.toml gitleaks.toml 2>/dev/null
```

If `.gitleaks.toml` is found:

- Pass it to `secret_scan.py` via `--gitleaks-config <path>`. The script will load its allowlists, path exclusions, stopwords, and custom rules automatically.
- Honor its ignore rules when classifying findings — a finding suppressed by policy is not a confirmed secret.
- Treat custom rules as additional detection constraints that supplement detect-secrets.

## Scan Mode Selection

Use **deep review** for user-authored code, configuration, infrastructure files,
documentation, and other manageable text where context changes severity.

Use **fast review** for:

- third-party or vendored code
- generated files
- very large diffs
- very long files where broad semantic reading is wasteful

Escalate from fast review to targeted semantic review when `secret_scan.py` reports findings.

## Scan Procedure

### Deep Review

1. Read the files or relevant diff hunks.
2. Perform semantic review for: cloud access keys, private or signing keys, production API tokens, database passwords, SSH credentials, CI credentials with release scope, and any values that appear to grant privileged access.
3. Run `secret_scan.py`:

   ```bash
   uv run scripts/secret_scan.py [--gitleaks-config .gitleaks.toml] <file-or-dir>...
   ```

4. If `.pre-commit-config.yaml` exists and already contains relevant secret-scanning hooks (e.g., `detect-secrets`, `gitleaks`), run those hooks instead of duplicating the workflow.
5. Reconcile semantic findings with `secret_scan.py` output. Classify likely false positives explicitly.

### Fast Review

1. Skip broad semantic reading.
2. Run `secret_scan.py` using `uv run`.
3. If `.pre-commit-config.yaml` exists with relevant hooks, run those hooks.
4. Semantically inspect only flagged locations and obviously high-risk files.

Always run `secret_scan.py` via `uv run` so its PEP 723 dependencies install automatically.
Do not invoke it with plain `python` unless dependencies are already managed separately.

## Binary And Non-Plaintext Files

When the scope includes PDF, PPT, DOCX, XLSX, or other binary formats:

1. Convert to text first (`pdftotext`, `pandoc`, `python-docx`, or any available local tool).
2. Scan the extracted text. Record the original binary file path in the report.
3. If no suitable local tool exists, mark the file as skipped and state the reason.

Do not claim coverage for binary files that were not actually converted.

## Severity

Use semantic judgment first. These categories are guidance, not a closed taxonomy.

- `Critical` — live credentials, private keys, production secrets, cloud tokens, signing material, or anything that can plausibly grant direct access or privileged control
- `High` — real internal secrets, non-production credentials with plausible validity, or combinations of identifiers that create material exposure
- `Medium` — partial or contextual sensitive data, non-production secrets with unclear validity, or findings that need more confirmation
- `Low` — weak signals, low-impact metadata, sample-like data with some risk, or findings likely to be test fixtures

Load [references/secret_types.md](references/secret_types.md) when severity is unclear after reading the content and surrounding context.

## Gotchas

- **`.gitleaks.toml` allowlists take precedence**: A finding suppressed by the repository's gitleaks policy is not a confirmed secret. Do not report it as confirmed — report it as ignored-by-policy when the suppression is explicit.
- **Test fixtures are the most common false positive**: Mock API keys, fixture phone numbers, documentation examples copied from vendor docs, and placeholder credentials in test files should remain in the suspected false positives section unless context confirms they are real.
- **detect-secrets does not catch every token format**: For high-value targets (e.g., AWS keys, GitHub tokens), supplement detect-secrets with semantic review of the specific file sections most likely to contain credentials.
- **`--cached` vs. `--diff` scope boundary**: When auditing pre-commit, `git diff --cached` is the authoritative boundary — it shows what will actually be committed, not what is in the working tree.
- **Custom gitleaks rules fire independently of detect-secrets**: `secret_scan.py` applies both detect-secrets and any custom rules from `.gitleaks.toml`. A finding from `custom-rule` source is as real as one from `Detect-secrets`.
- **Stopwords in `.gitleaks.toml` suppress entire lines**: A single stopword match silences all detect-secrets hits on that line, including real secrets. If a suspicious line is suppressed by stopword, flag it for manual review.

## Reporting

The final report must include:

- whether secrets were found
- the declared audit boundary
- the chosen scan mode and reason
- the resolved file list and file types
- confirmed findings
- suspected false positives
- skipped files and reasons
- gitleaks policy file used (if any)

List concrete findings in this format:

```text
./path/to/file:line:column | Severity | Secret | Source | Status | Summary
```

Use these source labels:

- `Detect-secrets` — finding from `secret_scan.py`
- `custom-rule` — finding from a `.gitleaks.toml` custom rule via `secret_scan.py`
- `Fuzzy review` — finding from semantic analysis

If a detector only provides a line number, use column `1`.
`Status` is either `Confirmed`, `Suspected FP`, or `Ignored by policy`.
