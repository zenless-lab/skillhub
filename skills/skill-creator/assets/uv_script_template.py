#!/usr/bin/env -S uv run
# /// script
# dependencies = [
#   "httpx>=0.27,<1",
# ]
# requires-python = ">=3.11"
# ///
"""[One-line description of what this script does.]

Usage:
  uv run scripts/[script_name].py --input FILE [options]

Examples:
  uv run scripts/[script_name].py --input data.json
  uv run scripts/[script_name].py --input data.json --output result.json
"""

import argparse
import json
import sys


def main() -> None:
    parser = argparse.ArgumentParser(
        description="[One-line description of what this script does.]",
    )
    parser.add_argument(
        "--input",
        required=True,
        metavar="FILE",
        help="Path to the input file.",
    )
    parser.add_argument(
        "--output",
        metavar="FILE",
        help="Write output to FILE instead of stdout.",
    )
    # Add additional arguments here.
    args = parser.parse_args()

    # --- Core logic ---
    try:
        result = process(args.input)
    except FileNotFoundError:
        print(f"Error: input file not found: {args.input!r}", file=sys.stderr)
        sys.exit(1)
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        sys.exit(1)

    # --- Output ---
    output = json.dumps(result, indent=2)
    if args.output:
        with open(args.output, "w") as f:
            f.write(output)
        print(f"Wrote output to {args.output}", file=sys.stderr)
    else:
        print(output)


def process(input_path: str) -> dict:
    """[Describe what this function does.]"""
    # Replace with actual logic.
    return {"status": "ok", "input": input_path}


if __name__ == "__main__":
    main()
