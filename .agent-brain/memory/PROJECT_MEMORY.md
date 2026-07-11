# Project Memory

Projeto: CODEX BRAIN

Codex Brain e uma ferramenta local-first para registrar sessoes do Codex, eventos, prompts, mudancas reais no Git, memoria tecnica e relatorios de continuidade.

## Estado atual

- CLI inicial em construcao.
- Armazenamento local em Markdown e JSONL.
- Sem banco externo, servidor, dashboard ou SaaS.
- Skill `next-prompt` criada para executar o ultimo ou um prompt numerado gerado em `.agent-brain/reports/`.
- Pacote npm `codex-brain@0.1.0` publicado com comando `npx codex-brain quickstart`.

## Como usar

1. Rode `codex-brain init`.
2. Rode `codex-brain install-hooks`.
3. Revise e confie nos hooks pelo fluxo do Codex.
4. Use `codex-brain report` e `codex-brain next` para fechar e continuar sessoes.
5. Use `/next-prompt` no Codex para executar o ultimo next prompt, ou peca um prompt numerado como `prompt 4`.
6. Para uso publico, rode `npx codex-brain quickstart`.

## Decisoes principais

- Git e a fonte da verdade para o que realmente mudou.
- A primeira versao e offline e local-first.
- Hooks nao devem bloquear o Codex nesta fase.

## Proximos passos

- Validar comandos basicos.
- Simular hooks com stdin.
- Melhorar heuristicas de relatorio.
