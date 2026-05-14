#!/usr/bin/env node
/**
 * scripts/check_skill_meta.mjs
 *
 * Validate SKILL.md files for metadata correctness and size guidelines.
 *
 * Checks each skills/<name>/SKILL.md file for:
 * - YAML front matter presence (--- delimiters)
 * - Required fields: name, description
 * - description length: warning >512 chars, stronger warning >768 chars, error >1024 chars
 * - compatibility length: warning >500 chars
 * - File line count: warning >500 lines, stronger warning >1000 lines
 *
 * Usage:
 *   node scripts/check_skill_meta.mjs               # validate all skills
 *   node scripts/check_skill_meta.mjs [file ...]    # validate specific SKILL.md files
 *
 * Exit codes:
 * - 0: all checks passed (warnings may have been printed)
 * - 1: one or more hard errors detected
 */

import { readFileSync } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);

/** Return a list of [level, message] pairs for a single SKILL.md path. */
function checkSkill(filePath) {
  const issues = [];
  const text = readFileSync(filePath, "utf8");
  const lineCount = text.split("\n").length;

  if (lineCount > 1000) {
    issues.push([
      "WARNING",
      `SKILL.md is ${lineCount} lines. This is very large — move detailed content to references/ files.`,
    ]);
  } else if (lineCount > 500) {
    issues.push([
      "WARNING",
      `SKILL.md is ${lineCount} lines (>500). Consider splitting detailed content into references/ files.`,
    ]);
  }

  let parsed;
  try {
    parsed = matter(text);
  } catch {
    issues.push([
      "ERROR",
      "Failed to parse YAML front matter. Ensure the file starts with --- delimiters.",
    ]);
    return issues;
  }

  if (!parsed.matter) {
    issues.push([
      "ERROR",
      "Missing YAML front matter (expected --- delimiters at top of file).",
    ]);
    return issues;
  }

  const fields = parsed.data;

  if (!fields.name) {
    issues.push(["ERROR", "Front matter is missing required field: name"]);
  }

  if (!fields.description) {
    issues.push([
      "ERROR",
      "Front matter is missing required field: description",
    ]);
  } else {
    const descLen = String(fields.description).length;
    if (descLen > 1024) {
      issues.push([
        "ERROR",
        `description is ${descLen} chars (limit: 1024). Shorten it.`,
      ]);
    } else if (descLen > 768) {
      issues.push([
        "WARNING",
        `description is ${descLen} chars (>768). Consider shortening it.`,
      ]);
    } else if (descLen > 512) {
      issues.push([
        "WARNING",
        `description is ${descLen} chars (>512). Consider trimming.`,
      ]);
    }
  }

  if (fields.compatibility != null) {
    const compatLen = String(fields.compatibility).length;
    if (compatLen > 500) {
      issues.push([
        "WARNING",
        `compatibility is ${compatLen} chars (>500). Move specific requirements into the skill body.`,
      ]);
    }
  }

  return issues;
}

// Collect paths: from CLI args or glob all skills/*/SKILL.md
const args = process.argv.slice(2);
let paths;
if (args.length > 0) {
  paths = args.filter((p) => path.basename(p) === "SKILL.md");
} else {
  paths = [];
  const skillsRoot = path.join(repoRoot, "skills");
  const entries = await readdir(skillsRoot, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    const candidate = path.join(skillsRoot, entry.name, "SKILL.md");
    try {
      const fileStat = await stat(candidate);
      if (fileStat.isFile()) {
        paths.push(candidate);
      }
    } catch (error) {
      if (error?.code !== "ENOENT") {
        throw error;
      }
      // Skip skills without SKILL.md
    }
  }
  paths.sort();
}

if (paths.length === 0) {
  process.exit(0);
}

let hasError = false;
for (const filePath of paths) {
  const issues = checkSkill(filePath);
  for (const [level, message] of issues) {
    const label =
      level === "WARNING"
        ? "\x1b[33mWARNING\x1b[0m"
        : "\x1b[31mERROR\x1b[0m";
    process.stderr.write(`${label}  ${filePath}: ${message}\n`);
    if (level === "ERROR") hasError = true;
  }
}

process.exit(hasError ? 1 : 0);
