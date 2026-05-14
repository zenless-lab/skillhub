# Justfile for skillhub
# Run `just` or `just check` to execute all quality checks.
# Run `just install-dev` once after cloning to install all dev dependencies.

# Run all quality checks
check: lint-markdown lint-python check-skill-metadata

# Install all development dependencies (markdownlint, ruff)
install-dev: _install-node-deps _install-python-deps

# Lint Markdown files; pass file paths as extra args (or none to lint all)
lint-markdown *files:
    npm run lint:md -- {{files}}

# Lint and auto-fix Python files with ruff
lint-python *args:
    ruff check {{args}}

# Validate SKILL.md front matter and size guidelines; pass paths or leave empty for all
check-skill-metadata *files:
    npm run check:skill-meta -- {{files}}

# Run all pre-commit hooks on every file in the repository
run-pre-commit-all:
    pre-commit run --all-files

# --- Private install helpers ---

_install-node-deps:
    npm install

_install-python-deps:
    pipx install ruff
