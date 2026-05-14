---
name: pii-guard
description: >
  Use this skill to scan files, git changes, commits, or pull requests for
  Personally Identifiable Information (PII) and personal data exposure. Trigger
  this skill when the user asks to check for PII, personal data, GDPR compliance,
  privacy review, email addresses, phone numbers, government IDs, or git identity
  leakage. Also use when asked to audit staged changes, modified files, commits,
  or entire repositories for privacy-related concerns. Trigger even if the user
  says "check for personal info", "scan for emails", "verify no private data", or
  "review identity exposure" without naming PII explicitly.
---

# PII Guard

Use this skill to detect personally identifiable information (PII) and personal
data exposure in code, configuration, documentation, and git history. Combine
Presidio-based automated scanning with semantic judgment, and declare the audit
boundary before any scan starts.

## Core Rules

1. Declare the audit boundary first. State the scope type and resolved files before scanning.
2. Check whether the target is git-backed, and whether `.pre-commit-config.yaml` exists with relevant hooks.
3. Choose scan depth from the change summary. Do not default to full semantic review for generated, third-party, or oversized changes.
4. When the scope is git-based, always review git author identity unless the user explicitly says not to.
5. Report precise findings and keep likely false positives separate.

## Scope Types

Supported scope types:

- Git: `staged`, `changed`, `commit <hash>`, `pr <id>`
- Filesystem: `entire repo`, `directory`, `specific file`

Load [references/scope_discovery.md](references/scope_discovery.md) when you need the concrete git or filesystem commands to resolve the boundary.

## Git Identity Review

When the audit scope is git-based, review git author identity as part of the PII scan:

- inspect `git config user.name` and `git config user.email`
- review authors in the audit range with `git --no-pager log --format="%an <%ae>"`
- flag names or emails that expose personal identity inappropriately

Load [references/git_identity_review.md](references/git_identity_review.md) for exact commands and interpretation guidance when the scope is git-based.

## Scan Mode Selection

Use **deep review** for user-authored code, configuration, infrastructure files,
documentation, and other manageable text where context changes severity.

Use **fast review** for:

- third-party or vendored code
- generated files
- very large diffs
- very long files where broad semantic reading is wasteful

Escalate from fast review to targeted semantic review when `pii_scan.py` reports findings.

## CUDA Check

Before running `pii_scan.py`, check CUDA availability once per session:

```bash
command -v nvidia-smi >/dev/null 2>&1 && nvidia-smi -L >/dev/null 2>&1
```

- If the command **succeeds** → use plain `uv run scripts/pii_scan.py`
- If the command **fails** → use `uv run --extra-index-url https://download.pytorch.org/whl/cpu --with torch scripts/pii_scan.py`

Do not skip this check or assume a result based on environment labels.

## Scan Procedure

### Deep Review

1. Read the files or relevant diff hunks.
2. Perform semantic review for: personal email addresses, phone numbers, government or national IDs, passport or license numbers, home addresses, employee/customer identifiers tied to a real person, and combinations of identifiers that create material exposure.
3. Run `pii_scan.py` using CUDA-aware `uv run`:

   ```bash
   uv run scripts/pii_scan.py [--language en] [--min-score 0.35] <file-or-dir>...
   ```

4. If `.pre-commit-config.yaml` exists and already contains relevant PII-scanning hooks, run those hooks instead of duplicating the workflow.
5. Reconcile semantic findings with `pii_scan.py` output. Classify likely false positives explicitly.

### Fast Review

1. Skip broad semantic reading.
2. Run `pii_scan.py` using CUDA-aware `uv run`.
3. If `.pre-commit-config.yaml` exists with relevant hooks, run those hooks.
4. Semantically inspect only flagged locations and obviously high-risk files.

Always run `pii_scan.py` via `uv run` so its PEP 723 dependencies install automatically.
Do not invoke it with plain `python` unless dependencies are already managed separately.

## Binary And Non-Plaintext Files

When the scope includes PDF, PPT, DOCX, XLSX, or other binary formats:

1. Convert to text first (`pdftotext`, `pandoc`, `python-docx`, or any available local tool).
2. Scan the extracted text. Record the original binary file path in the report.
3. If no suitable local tool exists, mark the file as skipped and state the reason.

Do not claim coverage for binary files that were not actually converted.

## Severity

Use semantic judgment first. These categories are guidance, not a closed taxonomy.

- `Critical` — government IDs, passport numbers, financial account numbers, or combinations that directly enable identity theft or fraud
- `High` — real personal email, phone number, full name with address, or customer data clearly attributable to a real person
- `Medium` — partial or contextual personal data, non-production identifiers with unclear attributability, findings needing more context
- `Low` — weak signals, low-impact metadata, fixture-like data with residual risk

## Gotchas

- **Stanza cold-start delay**: The first run downloads the Stanza NLP model; this can take several minutes. Do not retry or report failure — wait for the download to complete.
- **CUDA check required every session**: Do not skip the CUDA availability check based on a previous result. Environment GPU configuration can change between sessions.
- **Placeholder emails are almost always false positives**: `user@example.com`, `noreply@example.com`, and `test@example.com` belong in the suspected false positives section unless context confirms they reference real identities.
- **UUIDs and opaque hashes are not PII**: Identifiers with no person-linkage should not be reported as PII, even if they superficially resemble secrets.
- **`--min-score` threshold**: The default `0.35` is intentionally permissive. Findings between `0.35` and `0.60` are often false positives — triage these semantically before including them in confirmed findings.
- **Git identity is PII**: A personal mailbox or full legal name in git history or config is a privacy exposure. Always review it for git-backed scopes.
- **Staged vs. working tree scope**: `git diff --cached` shows only the staged delta. If the user wants unsaved edits audited too, also run `git diff` (working tree) and `git ls-files --others --exclude-standard` (untracked files).

## Reporting

The final report must include:

- whether PII was found
- the declared audit boundary
- the chosen scan mode and reason
- the resolved file list and file types
- confirmed findings
- suspected false positives
- skipped files and reasons
- git identity review results (git-based scopes only)

List concrete findings in this format:

```text
./path/to/file:line:column | Severity | PII | Source | Status | Summary
```

Use these source labels:

- `Presidio` — finding from `pii_scan.py`
- `Fuzzy review` — finding from semantic analysis
- `Git identity` — finding from git config or log inspection

If a detector only provides a line number, use column `1`.
`Status` is either `Confirmed` or `Suspected FP`.
