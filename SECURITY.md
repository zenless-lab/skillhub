# Security

> **Purpose:** Defines the security policies, PII rules, and secret-handling practices
> for the skillhub repository. Agents and contributors must read this before committing
> files that could contain personal information, credentials, or sensitive data.

## PII Policy

The following content is **prohibited** in all committed files:

| Category | Prohibited | Allowed exceptions |
| --- | --- | --- |
| Email addresses | Any real personal email | GitHub/GitLab anonymous noreply addresses; RFC 2606 documentation domains (`example.com`, `example.org`, `example.net`) |
| IPv4 addresses | Any public routable IP | RFC 1918 private ranges; RFC 5737 documentation ranges; loopback (`127.x.x.x`); well-known DNS servers (see `.gitleaks.toml`) |
| IPv6 addresses | Any public routable IPv6 | RFC 3849 documentation prefix (`2001:db8::`); loopback (`::1`); well-known DNS64 servers |

Run `just run-pre-commit-all` to verify before committing, or rely on the automatic pre-commit hooks on `git commit`.

## Secret Policy

No secrets may appear in committed files:

- API keys, tokens, and access credentials
- Private keys and certificates
- Database passwords and connection strings
- Any value that grants access to an external system

Secrets must be loaded from environment variables or a secrets manager at runtime.
They must never be hard-coded or stored in the repository, including in comments,
documentation, or example configurations.

## Detection Stack

Three independent layers catch secrets and PII before and after commits:

| Layer | Tool | Scope |
| --- | --- | --- |
| Pre-commit (staged files) | `gitleaks` with `.gitleaks.toml` PII rules | Email, IPv4, IPv6, built-in secret rules |
| Pre-commit (staged files) | `detect-secrets` with `.secrets.baseline` | High-entropy strings and known secret patterns |
| CI (full history) | TruffleHog (`.github/workflows/secret.yml`) | Verified secrets across all pushed commits |

### Managing `.secrets.baseline`

When `detect-secrets` flags a false positive, update the baseline rather than disabling the hook:

```bash
detect-secrets scan --baseline .secrets.baseline
```

Review the diff before committing the updated baseline.

## Dependency Supply Chain

- Review all new skills and scripts for embedded credentials before merging.
