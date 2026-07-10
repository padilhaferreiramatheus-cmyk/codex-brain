# Security Policy

Codex Brain runs inside developer workflows and touches session context, prompts, Git metadata, and local project memory. Security and privacy issues matter.

## Supported Versions

Codex Brain is currently in public preview. Security fixes target the latest version on `main` until formal releases begin.

## Reporting A Vulnerability

Please do not paste secrets, private session logs, or full proprietary reports into public issues.

If GitHub private vulnerability reporting is available for this repository, use it. Otherwise, open a minimal public issue that describes the affected area without exposing private data.

Useful details include:

- affected command or hook;
- operating system;
- Node version;
- sanitized reproduction steps;
- whether secrets, prompts, or file paths could be exposed.

## Security Goals

- Keep the default workflow local-first.
- Avoid collecting credentials or tokens.
- Mask common secret patterns.
- Truncate large hook payloads.
- Make generated hook behavior inspectable.
- Avoid dangerous Codex modes by default.

## Non-Goals For The First Version

- No hosted service.
- No external database.
- No cloud sync.
- No telemetry.
- No remote AI processing for reports.
