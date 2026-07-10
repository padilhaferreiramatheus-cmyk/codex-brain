---
name: next-prompt
description: Finds and runs the latest Codex Brain next-prompt Markdown file. Use when Matheus types /next-prompt, asks to continue from the latest next prompt, or asks to run a numbered next prompt such as prompt 4.
---

# Next Prompt

## Quick Start

When Matheus types `/next-prompt`, find the newest Codex Brain next-prompt file and treat its Markdown contents as the active continuation prompt.

```powershell
Get-ChildItem -LiteralPath ".agent-brain\reports" -Filter "*next-prompt*.md" |
  Sort-Object LastWriteTime, Name |
  Select-Object -Last 1
```

If Matheus asks for a numbered prompt, such as `prompt 4`, select the matching suffix:

```powershell
Get-ChildItem -LiteralPath ".agent-brain\reports" -Filter "*next-prompt-4.md" |
  Sort-Object LastWriteTime, Name |
  Select-Object -Last 1
```

## Workflow

1. Check project memory before durable changes:
   - `.agent-brain/memory/PROJECT_MEMORY.md`
   - `.agent-brain/memory/DECISIONS.md`
   - `.agent-brain/memory/DONT_DO.md`
   - `.agent-brain/memory/ROADMAP.md`
   - `.agent-brain/memory/OPEN_QUESTIONS.md`
   - `.agent-brain/memory/CONFLICTS.md`
2. Select the prompt file:
   - explicit number wins, for example `prompt 4` maps to `*next-prompt-4.md`;
   - otherwise use the newest `*next-prompt*.md` by `LastWriteTime` and name.
3. Read the selected Markdown file completely.
4. Tell Matheus which file is being executed.
5. Follow the prompt as the current task instructions.
6. Run the validations suggested by the prompt when they are safe and available.
7. If the prompt creates a real new decision, update memory with a small, explicit entry.

## Safety

- `/next-prompt` is a user-message trigger for this skill, not a PowerShell slash command.
- Do not delete `.agent-brain/`, `.codex/hooks.json`, or `.codex/hooks/`.
- Do not overwrite old reports or next prompts.
- Do not use dangerous Codex modes such as `danger-full-access`, `yolo`, or approval bypasses by default.
- If no next-prompt file exists, say so and run `codex-brain daily` only when Matheus asked to generate a fresh continuation.
