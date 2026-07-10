# Agent Instructions

<!-- codex-brain-memory -->
## Codex Brain memory

Before making durable changes in this project, check the local memory files in:

- .agent-brain/memory/PROJECT_MEMORY.md
- .agent-brain/memory/DECISIONS.md
- .agent-brain/memory/DONT_DO.md
- .agent-brain/memory/ROADMAP.md
- .agent-brain/memory/OPEN_QUESTIONS.md
- .agent-brain/memory/CONFLICTS.md

Respect these files unless the user explicitly updates the project direction.

Codex Brain installed these project-local files intentionally:

- .agent-brain/
- .codex/hooks.json
- .codex/hooks/

Do not delete, revert, or "clean up" those paths just because they appear as Git changes.
Only remove them if Matheus explicitly asks to uninstall Codex Brain.

When Matheus types "/hooks", that means he wants to open Codex's hook review/trust flow.
Do not interpret "/hooks" as a request to delete hook files.
<!-- codex-brain-memory -->
