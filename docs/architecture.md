# Architecture

Codex Brain e uma CLI local-first com armazenamento em Markdown e JSONL.

## Componentes

- `src/cli.ts`: entrada da CLI.
- `src/commands`: comandos publicos.
- `src/core`: regras de negocio e integracao com Git.
- `src/hooks`: builders de eventos de hooks.
- `src/providers`: interface futura de provider.
- `src/utils`: filesystem, JSONL, shell, tempo, paths e markdown.
- `src/templates`: referencia dos arquivos gerados.

## Fonte da verdade

Git e a fonte da verdade para o que realmente mudou. Eventos e prompts explicam contexto, mas relatorios devem sempre comparar intencao com `git status` e `git diff --stat`.

## Storage

- Eventos: JSONL em `.agent-brain/events/raw/`.
- Relatorios: Markdown em `.agent-brain/reports/`.
- Memoria: Markdown em `.agent-brain/memory/`.

## Extensao futura

`AgentProvider` existe para permitir analise read-only com Codex no futuro. A primeira versao nao implementa outros agentes.
