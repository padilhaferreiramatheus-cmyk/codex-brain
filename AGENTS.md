# Agent Instructions

## Papel deste repositório

Este repositório é o cérebro global de Matheus. Ele organiza projetos, relações,
regras de trabalho com agentes, padrões de documentação, skills reutilizáveis e
resumos controlados.

Ele não é mais uma CLI, pacote npm, instalador de hooks ou coletor de sessões.

## Antes de mudanças duráveis

Leia primeiro:

- `registry/projects.yml`
- `graph/relationships.md`
- `graph/relations.yml`
- `docs/decisions.md`
- `docs/operating-model.md`
- `agents/working-with-matheus.md`

## Regras práticas

- Responda em português do Brasil, salvo pedido contrário.
- Não copie projetos inteiros para dentro deste repositório.
- Os projetos devem ficar como pastas irmãs em `C:\Projetos`, e o Codex Brain
  deve apontar para eles por caminho local, resumo e relação.
- Não registre segredos, tokens, dados pessoais sensíveis, arquivos `.env`,
  contratos privados ou conteúdo completo de clientes.
- Use `local/` ou `private/` somente para notas locais que não devem ser
  versionadas.
- Ao adicionar um projeto, atualize `registry/projects.yml` e, quando fizer
  sentido, `graph/relations.yml`.
- Ao registrar uma decisão durável, atualize `docs/decisions.md`.
- Não fazer commit, push, abrir PR, publicar pacote, deployar ou alterar remoto
  sem autorização explícita de Matheus.
