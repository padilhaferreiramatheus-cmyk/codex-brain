# Codex Brain

Languages: English | [Português (Brasil)](README.pt-BR.md)

Codex Brain is Matheus's global project brain.

It does not store full copies of every project. It stores the map: which
projects exist, where they live, how they relate, which agent rules should be
reused, which documentation standards matter, and which shared context should be
available across projects.

## Main Decision

Projects live as sibling folders under `C:\Projetos`:

```text
C:\Projetos\
  CODEX BRAIN\
  ObraFlow\
  espcons\
  Vlog My Job\
  Espaço da Construção\
  Pessoal\
```

`CODEX BRAIN` does not contain the other projects. It points to them.

## Structure

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

## Mental Model

Each project stores its own details.

Codex Brain stores the map between projects.

## How To Use

1. Before working on a project, read `registry/projects.yml`.
2. Check the main relationships in `graph/relationships.md`.
3. Use `agents/working-with-matheus.md` to align the working style.
4. When a new relationship is discovered, update `graph/relations.yml`.
5. When a new project is registered, create a card in `registry/projects/`.

## What Does Not Belong Here

- Full code copies from other projects.
- Sensitive data.
- `.env` files.
- Private contracts.
- Raw session reports.
- Full videos, documents, or internal databases.

This repository is for controlled context, not accumulation.
