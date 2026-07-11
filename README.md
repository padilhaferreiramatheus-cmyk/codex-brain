# Codex Brain

[![CI](https://github.com/padilhaferreiramatheus-cmyk/codex-brain/actions/workflows/ci.yml/badge.svg)](https://github.com/padilhaferreiramatheus-cmyk/codex-brain/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js >=20](https://img.shields.io/badge/node-%3E%3D20-339933.svg)](package.json)

The missing memory layer for Codex-powered development.

Codex moves fast. Git shows what changed. Codex Brain helps you remember why it changed.

Codex Brain is a local-first CLI that captures Codex session context, prompts, tool usage, Git state, project memory, and continuity reports so you can return to a codebase without rebuilding the whole story from chat history.

No cloud sync. No database. No dashboard. No telemetry. Just Markdown, JSONL, Git, and a workflow that keeps technical intent close to the repo.

## Why It Exists

AI coding sessions create a strange new gap:

- the user asked for one thing;
- the agent said it did another thing;
- the repository contains the only truth that actually matters.

Codex Brain turns that gap into a readable report. Every session can produce a "promise vs reality" summary that compares:

- what the user asked for;
- what Codex reported back;
- what Git says really changed.

That gives solo builders, maintainers, and teams a lightweight audit trail without sending project context to a service.

## What You Get

- Local technical memory in `.agent-brain/memory/`
- Raw hook events stored as JSONL
- Daily reports written as Markdown
- Next-prompt files for clean session handoffs
- Git status and diff summaries in every report
- Conflict hints against project memory
- Secret masking and payload truncation in hooks
- A `/next-prompt` skill for continuing from the latest generated prompt

Codex Brain is built for the moment when "I think the agent fixed it" is not good enough.

## Quick Start

From npm:

```bash
npx codex-brain quickstart
```

Or install it globally:

```bash
npm install -g codex-brain
codex-brain quickstart
```

During local development:

```bash
npm install
npm run build
npm run quickstart
npm run smoke
```

After installing or linking the package:

```bash
codex-brain quickstart
codex-brain selftest
```

On Windows PowerShell, use `npm.cmd` if execution policy blocks `npm`:

```powershell
npm.cmd run quickstart
npm.cmd run smoke
```

## The Daily Flow

1. Enter the root of your project.
2. Run `codex-brain quickstart`.
3. Review and trust the generated hooks from inside Codex with `/hooks`.
4. Work normally with Codex.
5. Run `codex-brain checkpoint` when you want a named point in the work.
6. Run `codex-brain daily` at the end of a session.
7. Continue later with the generated `next-prompt` file or the `/next-prompt` skill.

If you are using this checkout directly from another project:

```powershell
cd C:\Projetos\your-project
& "C:\Projetos\CODEX BRAIN\codex-brain.cmd" quickstart
& "C:\Projetos\CODEX BRAIN\codex-brain.cmd" selftest
& "C:\Projetos\CODEX BRAIN\codex-brain.cmd" daily
& "C:\Projetos\CODEX BRAIN\codex-brain.cmd" checkpoint --label fechamento
```

Do not run `npm.cmd run quickstart` inside another project unless that project's own `package.json` defines that script.

## See It In Action

Start with the sanitized demo transcript:

- [Demo session](examples/demo-session.md)
- [Example report](examples/report.md)
- [Example next prompt](examples/next-prompt.md)
- [Example memory snapshot](examples/memory-snapshot.md)
- [Launch checklist](docs/launch-checklist.md)

## Commands

```bash
codex-brain quickstart
codex-brain selftest
codex-brain init
codex-brain install-hooks
codex-brain doctor
codex-brain status
codex-brain timeline
codex-brain checkpoint
codex-brain checkpoint --label meio-dia
codex-brain checkpoint --label fechamento
codex-brain daily
codex-brain report
codex-brain next
codex-brain hooks-help
codex-brain conflict-check "refazer tudo do zero sem teste"
```

For development inside this repository:

```powershell
npm.cmd run dev -- quickstart
npm.cmd run dev -- selftest
npm.cmd run dev -- timeline
npm.cmd run dev -- daily
npm.cmd run dev -- checkpoint --label meio-dia
```

## Reports

A report can include:

- project name, branch, commit, and date;
- detected session objective;
- prompts captured during the day;
- final Codex responses;
- tools and commands used;
- files changed according to Git;
- `git status`;
- `git diff --stat`;
- promise vs reality;
- possible conflicts;
- risks;
- progress score;
- next best prompt.

Reports are generated into `.agent-brain/reports/`, which is treated as local runtime output. Keep the reports when you need them; do not publish them by default.

## Hooks

`codex-brain install-hooks` creates project-local Codex hooks:

```text
.codex/
  hooks.json
  hooks/
    package.json
    README.md
    codex-brain-session-start.js
    codex-brain-user-prompt-submit.js
    codex-brain-post-tool-use.js
    codex-brain-stop.js
```

The hooks:

- read JSON from stdin;
- write events to `.agent-brain/events/raw/*.jsonl`;
- mask common secret patterns;
- truncate large payloads;
- log hook errors locally;
- always exit with code `0`;
- do not write to stdout;
- do not send data outside your machine.

`/hooks` is a Codex interface command, not a PowerShell command. Use it inside Codex to inspect and trust local hooks.

## Local Storage

```text
.agent-brain/
  config.json
  events/
    raw/
    normalized/
  sessions/
  reports/
  memory/
    PROJECT_MEMORY.md
    DECISIONS.md
    DONT_DO.md
    ROADMAP.md
    OPEN_QUESTIONS.md
    CONFLICTS.md
```

Git remains the source of truth for what changed. Codex Brain adds the context around those changes.

## Privacy And Security

Codex Brain is intentionally boring about data.

- No external server
- No cloud database
- No telemetry
- No API calls for report generation
- No credential collection
- No dangerous Codex modes by default

The first version masks common patterns such as:

- `OPENAI_API_KEY`
- `sk-`
- `ghp_`
- `github_pat_`
- `password=`
- `senha=`
- `token=`
- `api_key=`

Avoid using `--dangerously-bypass-approvals-and-sandbox`, `--dangerously-bypass-hook-trust`, `danger-full-access`, or `yolo` as default workflows.

## Who It Is For

Codex Brain is useful when you:

- work with Codex across long sessions;
- come back to a repo days later and need the real thread;
- want local AI-work audit trails without SaaS;
- need reports that compare intention against Git;
- maintain multiple projects and want lightweight continuity;
- want better handoffs between humans and coding agents.

## What It Is Not Yet

Codex Brain is early.

- It is not a dashboard.
- It is not a SaaS product.
- It is not a replacement for Git.
- It is not a multi-agent platform.
- It does not use an external AI service to write reports.

Those are deliberate constraints. The first job is to make the local CLI trustworthy.

## Roadmap

1. Reliable local CLI
2. Stable Codex hooks
3. Better promise-vs-reality reports
4. Optional Graphify integration
5. VS Code extension, if the CLI proves the workflow
6. SaaS only if it becomes a real product without compromising local-first

## Development

```bash
npm run typecheck
npm run build
npm test
```

Manual checks:

```bash
npm run quickstart
npm run smoke
npm run dev -- doctor
npm run dev -- status
npm run dev -- timeline
npm run dev -- report
npm run dev -- next
```

## Troubleshooting

If PowerShell blocks `npm`, use:

```bash
npm.cmd -v
```

If hooks do not run, open `/hooks` inside Codex and confirm that the local hook commands have been reviewed and trusted.

If `status` shows `not-a-git-repo`, initialize Git in the project or run Codex Brain from inside an existing repository.

## Contributing

Contributions are welcome while the project stays focused: reliable CLI first, local-first by default, security before spectacle.

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

MIT
