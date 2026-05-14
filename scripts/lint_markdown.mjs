#!/usr/bin/env node
/**
 * scripts/lint_markdown.mjs
 *
 * Lint Markdown files using the markdownlint Node.js library.
 * Configuration is read from .markdownlint.json in the repository root.
 *
 * Usage:
 *   node scripts/lint_markdown.mjs               # lint all .md files
 *   node scripts/lint_markdown.mjs [file ...]    # lint specific files
 */

import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { lint, readConfig } from "markdownlint/promise";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const configFile = path.join(repoRoot, ".markdownlint.json");

async function collectMarkdownFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "node_modules") {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(fullPath)));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
}

// Collect files to lint — either from CLI args or glob all .md files
let files;
if (process.argv.length > 2) {
  files = process.argv.slice(2);
} else {
  files = await collectMarkdownFiles(repoRoot);
}

if (files.length === 0) {
  process.exit(0);
}

const config = await readConfig(configFile);
const results = await lint({ files, config });

let errorCount = 0;
for (const [file, errors] of Object.entries(results)) {
  for (const error of errors) {
    const rule = error.ruleNames.join("/");
    const detail = error.errorDetail ? ` [${error.errorDetail}]` : "";
    const ctx = error.errorContext ? ` "${error.errorContext}"` : "";
    console.error(
      `${file}:${error.lineNumber}: ${rule} ${error.ruleDescription}${detail}${ctx}`
    );
    errorCount++;
  }
}

if (errorCount > 0) {
  process.exit(1);
}
