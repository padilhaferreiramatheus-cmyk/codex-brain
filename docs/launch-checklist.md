# Launch Checklist

This checklist exists to keep Codex Brain honest as an open-source project. Stars follow clarity, trust, and immediate usefulness.

## Before Sharing Widely

- Keep the README crisp and current.
- Keep CI green on Linux and Windows.
- Keep the npm install path working: `npx codex-brain quickstart`.
- Keep private runtime files out of Git:
  - `.agent-brain/events/`
  - `.agent-brain/reports/`
  - `.agent-brain/sessions/`
  - `.agent-brain/tmp/`
  - `.codex/hooks.json`
  - `.codex/hooks/`
- Keep examples sanitized.
- Run:

```bash
npm run typecheck
npm run build
npm test
npm run smoke
```

## GitHub Repo Setup

- Add topics:
  - `codex`
  - `openai-codex`
  - `ai-coding`
  - `agent-memory`
  - `developer-tools`
  - `local-first`
  - `cli`
- Confirm the security policy is visible.
- Confirm issue templates are visible.
- Confirm the CI badge resolves.

## Adoption Signals

The project needs three things for broader adoption:

1. A short demo people can understand in under 30 seconds.
2. A zero-friction install path that keeps working: `npx codex-brain quickstart`.
3. A real example showing promise-vs-reality against a Git diff.

## Launch Copy

Short version:

> Git shows what changed. Codex Brain shows why it changed.

Long version:

> Codex Brain is a local-first CLI that turns Codex sessions into readable project memory, Git-aware reports, and next prompts without sending your code or prompts to a server.

## Near-Term Product Work

- Improve report precision.
- Add more tests around hook payload parsing.
- Add safer generated hook previews.
- Record a real terminal demo.
