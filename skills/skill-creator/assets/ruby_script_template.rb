#!/usr/bin/env ruby
# frozen_string_literal: true

# [One-line description of what this script does.]
#
# Usage:
#   ruby scripts/[script_name].rb --input FILE [options]
#
# Examples:
#   ruby scripts/[script_name].rb --input data.json
#   ruby scripts/[script_name].rb --input data.json --output result.json

require 'bundler/inline'

gemfile do
  source 'https://rubygems.org'
  # Add gems here. Always pin versions.
  # gem 'nokogiri', '~> 1.16'
  # gem 'httparty', '= 0.22.0'
end

require 'json'
require 'optparse'

# --- Argument parsing ---
options = {}
OptionParser.new do |opts|
  opts.banner = "Usage: ruby scripts/[script_name].rb --input FILE [options]"

  opts.on("--input FILE", "Path to the input file (required)") do |v|
    options[:input] = v
  end

  opts.on("--output FILE", "Write output to FILE instead of stdout") do |v|
    options[:output] = v
  end

  opts.on("-h", "--help", "Show this help message") do
    puts opts
    exit 0
  end
end.parse!

unless options[:input]
  warn "Error: --input is required"
  warn "Run with --help for usage."
  exit 2
end

# --- Core logic ---
def process_input(input_path)
  # Replace with actual logic.
  raise "Input file not found: #{input_path}" unless File.exist?(input_path)

  _content = File.read(input_path)
  { status: "ok", input: input_path }
end

begin
  result = process_input(options[:input])
  output = JSON.pretty_generate(result)

  if options[:output]
    File.write(options[:output], output)
    warn "Wrote output to #{options[:output]}"
  else
    puts output
  end
rescue => e
  warn "Error: #{e.message}"
  exit 1
end
