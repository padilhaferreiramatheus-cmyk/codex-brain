# Contributing

Thanks for your interest in Codex Brain.

The project is intentionally local-first. Contributions should make the CLI more trustworthy before adding heavier product surfaces.

## Principles

- Keep Git as the source of truth for what changed.
- Keep reports and memory readable as plain files.
- Do not send project data to external services by default.
- Do not require a database for the core workflow.
- Do not make hooks block Codex unless the behavior is explicit and documented.
- Avoid collecting secrets, credentials, full private logs, or unnecessary payloads.

## Local Setup

```bash
npm install
npm run build
npm run quickstart
npm run smoke
```

On Windows PowerShell, use `npm.cmd` if execution policy blocks `npm`:

```powershell
npm.cmd run quickstart
npm.cmd run smoke
```

## Validation

Run the core checks before opening a pull request:

```bash
npm run typecheck
npm run build
npm test
```

For manual validation:

```bash
npm run dev -- doctor
npm run dev -- status
npm run dev -- timeline
npm run dev -- report
npm run dev -- next
```

## Pull Requests

Good pull requests are small, testable, and explicit about trade-offs.

Please include:

- what changed;
- why it changed;
- how it was validated;
- any security or privacy implications;
- whether generated reports, events, or local hooks were intentionally excluded.

## Files That Should Usually Stay Local

Do not commit private runtime output by default:

- `.agent-brain/events/`
- `.agent-brain/reports/`
- `.agent-brain/tmp/`
- `.codex/hooks.json`
- `.codex/hooks/`

Use sanitized examples under `examples/` when documentation needs sample output.
