#!/usr/bin/env bun
/**
 * [One-line description of what this script does.]
 *
 * Usage:
 *   bun run scripts/[script_name].ts --input FILE [options]
 *
 * Examples:
 *   bun run scripts/[script_name].ts --input data.json
 *   bun run scripts/[script_name].ts --input data.json --output result.json
 */

// Add imports here. Pin exact versions in the specifier for auto-install.
// import * as cheerio from "cheerio@1.0.0";

import { readFileSync, writeFileSync } from "fs";

// --- Argument parsing ---
const args = parseArgs(process.argv.slice(2));

if (args.help) {
  console.log(`Usage: bun run scripts/[script_name].ts --input FILE [options]

Options:
  --input FILE    Path to the input file (required)
  --output FILE   Write output to FILE instead of stdout
  --help          Show this help message`);
  process.exit(0);
}

if (!args.input) {
  console.error("Error: --input is required");
  console.error("Run with --help for usage.");
  process.exit(2);
}

// --- Core logic ---
try {
  const result = process_input(args.input as string);
  const output = JSON.stringify(result, null, 2);

  if (args.output) {
    writeFileSync(args.output as string, output, "utf-8");
    console.error(`Wrote output to ${args.output}`);
  } else {
    console.log(output);
  }
} catch (err) {
  console.error(`Error: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
}

// --- Implementation ---
function process_input(inputPath: string): Record<string, unknown> {
  // Replace with actual logic.
  const _content = readFileSync(inputPath, "utf-8");
  return { status: "ok", input: inputPath };
}

// --- Minimal argument parser ---
function parseArgs(rawArgs: string[]): Record<string, string | boolean> {
  const result: Record<string, string | boolean> = {};
  for (let i = 0; i < rawArgs.length; i++) {
    const arg = rawArgs[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = rawArgs[i + 1];
      if (next && !next.startsWith("--")) {
        result[key] = next;
        i++;
      } else {
        result[key] = true;
      }
    }
  }
  return result;
}
