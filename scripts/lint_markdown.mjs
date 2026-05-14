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
 *   node scripts/lint_markdown.mjs --fix         # lint and auto-fix all .md files
 *   node scripts/lint_markdown.mjs --fix [file ...]  # lint and auto-fix specific files
 */

import { access, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { applyFixes } from "markdownlint";
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

// Parse --fix flag and remaining file arguments
const args = process.argv.slice(2);
const fixMode = args.includes("--fix");
const fileArgs = args.filter((a) => a !== "--fix");

// Collect files to lint — either from CLI args or glob all .md files
let files;
if (fileArgs.length > 0) {
  files = fileArgs;
} else {
  files = await collectMarkdownFiles(repoRoot);
}

if (files.length === 0) {
  process.exit(0);
}

/**
 * Walk up from a file's directory to repoRoot, returning the first
 * .markdownlint.json found in a subdirectory (i.e., not the root config).
 */
async function findLocalConfig(filePath) {
  let dir = path.dirname(path.resolve(filePath));
  while (dir !== repoRoot && dir.startsWith(repoRoot)) {
    const candidate = path.join(dir, ".markdownlint.json");
    try {
      await access(candidate);
      return candidate;
    } catch {
      dir = path.dirname(dir);
    }
  }
  return null;
}

// Group files by the nearest local config (null = root config)
const configGroups = new Map();
for (const file of files) {
  const local = await findLocalConfig(file);
  const key = local ?? "__root__";
  if (!configGroups.has(key)) configGroups.set(key, []);
  configGroups.get(key).push(file);
}

// Resolve config for each group, then lint
const groupResultList = await Promise.all(
  Array.from(configGroups.entries()).map(async ([key, groupFiles]) => {
    const cfg = await readConfig(key === "__root__" ? configFile : key);
    return lint({ files: groupFiles, config: cfg });
  })
);

const results = Object.assign({}, ...groupResultList);

// Apply auto-fixes when --fix is passed
if (fixMode) {
  for (const [file, errors] of Object.entries(results)) {
    if (errors.some((e) => e.fixInfo)) {
      const original = await readFile(file, "utf8");
      const fixed = applyFixes(original, errors);
      if (fixed !== original) {
        await writeFile(file, fixed, "utf8");
      }
    }
  }
}

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
