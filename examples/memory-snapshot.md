# Example Memory Snapshot

This is a sanitized example of the local memory Codex Brain keeps under `.agent-brain/memory/`.

## PROJECT_MEMORY.md

```md
# Project Memory

Project: example-project

Example Project is a local-first CLI that helps developers preserve technical context across AI coding sessions.

## Current State

- CLI is usable locally.
- Reports are Markdown.
- Events are JSONL.
- No external service is required.

## Next Steps

- Improve report accuracy.
- Add more hook tests.
- Publish a clean demo.
```

## DECISIONS.md

```md
# Decisions

## 2026-07-10 - Keep storage local-first

Decision:
Store project memory, events, and reports as local files.

Reason:
Developers should be able to inspect, commit, ignore, move, or delete their own context.
```

## DONT_DO.md

```md
# Do Not Do

- Do not send project context to external services by default.
- Do not collect credentials.
- Do not overwrite old reports.
- Do not require a database for the first version.
```
