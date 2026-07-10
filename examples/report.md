# Example Report

This is a sanitized example of a Codex Brain report.

````md
# Codex Brain report - 2026-07-10

## Project

- Name: example-project
- Path: /work/example-project
- Branch: main
- Commit: 1a2b3c4
- Date: 2026-07-10

## Detected Objective

Improve report quality and add tests.

## Day Summary

- Events captured: 12
- Prompts submitted: 3
- Tools/commands recorded: 5
- Files changed in Git: 4
- Conflict alerts: 0

## Promise vs Reality

- User asked: improve report quality and add tests
- Codex said it did: added a report summary section and test coverage
- Git shows: 4 files changed

## Git Status

```text
 M src/core/report-generator.ts
 M test/report-generator.test.ts
```

## Git Diff Stat

```text
 src/core/report-generator.ts      | 42 +++++++++++++++++++---
 test/report-generator.test.ts     | 28 +++++++++++++++
 2 files changed, 63 insertions(+), 7 deletions(-)
```

## Risks

- Report scoring is still heuristic.
- Large repositories may need stricter diff limits.

## Next Best Prompt

Continue improving report accuracy. Compare each report claim against Git status and diff stat.
````
