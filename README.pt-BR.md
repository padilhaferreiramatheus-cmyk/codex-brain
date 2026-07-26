# Codex Brain

Idiomas: [English](README.en.md) | Português (Brasil)

Codex Brain é o cérebro global de projetos do Matheus.

Ele não guarda cópias completas dos projetos. Ele guarda o mapa: quais projetos
existem, onde estão, como se relacionam, quais regras os agentes devem seguir,
quais padrões de documentação devem ser usados e quais skills/processos são
reutilizáveis.

## Decisão Principal

Os projetos ficam como pastas irmãs em `C:\Projetos`:

```text
C:\Projetos\
  CODEX BRAIN\
  ObraFlow\
  espcons\
  Vlog My Job\
  Espaço da Construção\
  Pessoal\
```

O `CODEX BRAIN` não contém os outros projetos. Ele aponta para eles.

## Estrutura

```text
registry/
  projects.yml
  projects/
graph/
  relationships.md
  relations.yml
  concepts.md
agents/
  working-with-matheus.md
  AGENTS.global.md
docs/
  operating-model.md
  documentation-standards.md
  decisions.md
  privacy-model.md
templates/
skills/
```

## Regra Mental

O projeto guarda os detalhes dele.

O Codex Brain guarda o mapa entre os projetos.

## Como Usar

1. Antes de trabalhar em um projeto, leia `registry/projects.yml`.
2. Veja as relações principais em `graph/relationships.md`.
3. Use `agents/working-with-matheus.md` para alinhar o jeito de trabalho.
4. Ao descobrir uma relação nova, atualize `graph/relations.yml`.
5. Ao cadastrar um projeto novo, crie um card em `registry/projects/`.

## O Que Não Entra Aqui

- Código completo de outros projetos.
- Dados sensíveis.
- Arquivos `.env`.
- Contratos privados.
- Relatórios brutos de sessão.
- Cópias de vídeos, documentos ou bases internas.

Este repositório é para contexto controlado, não para acúmulo.
