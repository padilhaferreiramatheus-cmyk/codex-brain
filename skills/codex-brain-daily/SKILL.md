---
name: codex-brain-daily
description: Run the Codex Brain daily workflow and explain the difference between PowerShell commands, Codex slash commands like /hooks, and Codex Brain CLI commands. Use when Matheus asks about Codex Brain, /hooks, daily usage, reports, next prompts, or wants the three main Codex Brain actions run more easily.
---

# Codex Brain Daily

## Quick Start

When the user wants the easy daily flow, prefer a checkpoint. A checkpoint can run more than once per day:

```powershell
& "C:\Projetos\CODEX BRAIN\codex-brain.cmd" checkpoint
& "C:\Projetos\CODEX BRAIN\codex-brain.cmd" checkpoint --label meio-dia
& "C:\Projetos\CODEX BRAIN\codex-brain.cmd" checkpoint --label fechamento
```

`daily` remains as a compatibility alias:

```powershell
& "C:\Projetos\CODEX BRAIN\codex-brain.cmd" daily
```

If `daily` is unavailable, run the three actions separately:

```powershell
& "C:\Projetos\CODEX BRAIN\codex-brain.cmd" status
& "C:\Projetos\CODEX BRAIN\codex-brain.cmd" report
& "C:\Projetos\CODEX BRAIN\codex-brain.cmd" next
```

## Explain The Surfaces

Always distinguish these surfaces:

- PowerShell: runs `codex-brain.cmd status/report/next/daily`.
- Codex Brain CLI: the local tool that writes `.agent-brain/` reports and memory.
- Codex slash command `/hooks`: only works inside a Codex interface that supports slash commands; it is not PowerShell and not a skill.
- Codex hooks config: `.codex/hooks.json` plus scripts in `.codex/hooks/`.

If the user types `/hooks` in the wrong place, explain that nothing special will happen there.

## Safety Rules

- Do not delete `.agent-brain/`, `.codex/hooks.json`, or `.codex/hooks/` unless Matheus explicitly asks to uninstall Codex Brain.
- Do not restore `hooks.json` to only Graphify. It should preserve Graphify hooks and include Codex Brain hooks together.
- If a report is requested, prefer `checkpoint` so status, report, and next prompt stay synchronized.
- If commands fail because the launcher is missing or old, run from `C:\Projetos\CODEX BRAIN` with `npm.cmd run build` before retrying.

## Detailed Prompt

When another Codex instance is confused, use [codex-brain-agent-prompt.md](references/codex-brain-agent-prompt.md).
