# Ruby Script Specification

Use this reference when writing or refactoring Ruby scripts for the `scripts/` directory.

---

## Inline Dependency Declaration with `bundler/inline`

Ruby scripts declare gem dependencies inline using `bundler/inline`, which ships with Bundler (included in Ruby since 2.6).

```ruby
require 'bundler/inline'

gemfile do
  source 'https://rubygems.org'
  gem 'nokogiri'
  gem 'httparty'
end
```

Place this block at the top of the script, before any requires that depend on the bundled gems.

---

## Running Scripts

```bash
ruby scripts/extract.rb
```

No prior `bundle install` step is needed. Bundler installs missing gems automatically on first run.

---

## Version Pinning

Always pin gem versions explicitly. There is no `Gemfile.lock` generated for inline gemfiles.

```ruby
gemfile do
  source 'https://rubygems.org'
  gem 'nokogiri', '~> 1.16'       # >= 1.16 and < 2
  gem 'httparty', '= 0.22.0'      # exact pin
end
```

| Specifier | Meaning |
| --- | --- |
| `'~> X.Y'` | `>= X.Y` and `< X+1` (pessimistic constraint) |
| `'~> X.Y.Z'` | `>= X.Y.Z` and `< X.Y+1` |
| `'= X.Y.Z'` | Exact pin |
| `'>= X.Y'` | Minimum only — avoid without an upper bound |

---

## Gemfile Interference Warning

`bundler/inline` is **disabled** when any of the following conditions are true:

- A `Gemfile` exists in the current working directory or any parent directory
- The `BUNDLE_GEMFILE` environment variable is set

In either case, Bundler uses the external `Gemfile` instead of the inline declaration, and the script will likely fail with missing gem errors.

**Mitigation:** Override with:

```bash
BUNDLE_GEMFILE=/dev/null ruby scripts/extract.rb
```

Document this requirement in `SKILL.md` if the skill is likely to be used in environments with existing `Gemfile`s.

---

## Shebang (Optional)

```ruby
#!/usr/bin/env ruby
```

Add a shebang and set the executable bit to allow direct invocation:

```bash
chmod +x scripts/extract.rb
./scripts/extract.rb
```

---

## Encoding

Ruby 3+ defaults to UTF-8 source encoding. For scripts that process arbitrary byte data, add at the top:

```ruby
# encoding: binary
```

---

## Design Rules for Agentic Scripts

The same agentic design rules apply as for other languages:

- **No interactive prompts.** Use `OptionParser` or `ARGV` for all input.
- **Implement `--help`.** Ruby's `OptionParser` generates it automatically.
- **Send data to stdout, diagnostics to stderr.**
- **Use structured output** (JSON, CSV) for machine consumption.
- **Use meaningful exit codes.** `exit(code)` sets the exit code.

```ruby
require 'optparse'

options = {}
OptionParser.new do |opts|
  opts.banner = "Usage: scripts/extract.rb --input FILE [options]"
  opts.on("--input FILE", "Path to input file") { |v| options[:input] = v }
  opts.on("--format FORMAT", "Output format: json, csv (default: json)") { |v| options[:format] = v }
end.parse!

unless options[:input]
  warn "Error: --input is required"
  exit 2
end
```
