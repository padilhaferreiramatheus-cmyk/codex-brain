# Demo Session

This is a sanitized transcript of the core Codex Brain loop.

```bash
$ codex-brain quickstart
Codex Brain quickstart

1. Initializing local memory...
2. Installing local Codex hooks...
3. Running doctor...

Next:
- Open Codex and review hooks with /hooks.
- Run codex-brain selftest.
```

```bash
$ codex-brain selftest
Codex Brain selftest concluido.

Generated:
- .agent-brain/reports/2026-07-10-report.md
- .agent-brain/reports/2026-07-10-next-prompt.md
```

```bash
$ codex-brain daily
Codex Brain daily

Status
Project: example-project
Branch: main
Commit: 1a2b3c4
Events today: 12
Prompts captured today: 3
Files changed in Git: 4

Generated files
Report: .agent-brain/reports/2026-07-10-report.md
Next prompt: .agent-brain/reports/2026-07-10-next-prompt.md
```

The key idea is simple: Git shows what changed; Codex Brain preserves why the session moved that way.
