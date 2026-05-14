#!/usr/bin/env -S deno run --allow-read
/**
 * [One-line description of what this script does.]
 *
 * Usage:
 *   deno run --allow-read scripts/[script_name].ts --input FILE [options]
 *
 * Examples:
 *   deno run --allow-read scripts/[script_name].ts --input data.json
 *   deno run --allow-read --allow-write scripts/[script_name].ts --input data.json --output result.json
 */

// Add imports here. Pin exact versions.
// import { load } from "npm:cheerio@1.0.0";

// --- Argument parsing ---
const args = parseArgs(Deno.args);

if (args.help) {
  console.log(`Usage: deno run --allow-read scripts/[script_name].ts --input FILE [options]

Options:
  --input FILE    Path to the input file (required)
  --output FILE   Write output to FILE instead of stdout
  --help          Show this help message`);
  Deno.exit(0);
}

if (!args.input) {
  console.error("Error: --input is required");
  console.error("Run with --help for usage.");
  Deno.exit(2);
}

// --- Core logic ---
try {
  const result = await process(args.input as string);
  const output = JSON.stringify(result, null, 2);

  if (args.output) {
    await Deno.writeTextFile(args.output as string, output);
    console.error(`Wrote output to ${args.output}`);
  } else {
    console.log(output);
  }
} catch (err) {
  console.error(`Error: ${err instanceof Error ? err.message : err}`);
  Deno.exit(1);
}

// --- Implementation ---
async function process(inputPath: string): Promise<Record<string, unknown>> {
  // Replace with actual logic.
  const _content = await Deno.readTextFile(inputPath);
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
