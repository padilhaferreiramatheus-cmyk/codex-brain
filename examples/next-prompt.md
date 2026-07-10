# Example Next Prompt

This is a sanitized example of a generated next prompt.

```md
# Next prompt for Codex

You are working on `example-project`.

Context:
- Branch: main
- Commit: 1a2b3c4
- Last detected objective: improve report quality
- Events captured today: 12
- Medium/high conflict alerts: 0

Goal for the next session:
Continue from the real Git state, preserve project memory decisions, and validate changes with small commands.

Relevant files:
- src/core/report-generator.ts
- src/core/git.ts
- test/report-generator.test.ts

Decisions that must not be broken:
- Keep storage local-first.
- Do not send project context to external services by default.
- Treat Git as the source of truth for what changed.

Suggested validation:
- npm run typecheck
- npm run build
- npm test
- codex-brain status
```
