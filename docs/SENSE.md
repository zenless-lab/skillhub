# Sense

> **Purpose:** Defines the product vision, guiding principles, and scope boundaries for
> skillhub. Read this when evaluating trade-offs, deciding whether a feature belongs in
> this repository, or determining what "done" looks like.

## Product Vision

skillhub is a curated library of reusable AI Agent skills for cross-framework use.
Any agent — regardless of the platform it runs on — should be able to install a skill
from this library and immediately benefit from expert-level, production-ready guidance
in its domain. Success means that agents using skillhub skills produce consistently
correct, high-quality output with less hallucination and less back-and-forth.

## Target Audience

| Segment | Primary Need |
| --- | --- |
| AI Agent operators | Reliable, domain-specific instruction sets that work without framework lock-in |
| Developers using AI assistants | Expert context for niche tools (chezmoi, cloud-init, Starlark, etc.) |
| Skill authors | A well-structured, quality-gated home for skills they want to share |

## Product Principles

1. **Cross-framework universality.** A skill must work with any agent that can read Markdown.
   No Copilot-only, Claude-only, or Cursor-only instructions.
2. **Progressive disclosure.** `SKILL.md` stays concise and actionable. Detailed reference
   material lives in `references/` and is loaded on demand.
3. **No implicit dependencies.** Skills do not assume other skills are installed. If a
   workflow references another skill, it includes instructions for obtaining it.
4. **Quality over quantity.** A small set of well-maintained, accurate skills is more
   valuable than a large collection of stale or incomplete ones.
5. **Agent-first authoring.** Content is written for agents to consume, not for humans
   to browse. Prefer imperative instructions over explanatory prose.
