# Modelo De Operação

## Objetivo

Codex Brain organiza os projetos de Matheus sem concentrar todos os arquivos em
uma pasta única.

## Organização De Pastas

Modelo recomendado:

```text
C:\Projetos\
  CODEX BRAIN\
  ObraFlow\
  espcons\
  Marketing Brain\
  outros-projetos\
```

O Codex Brain fica ao lado dos projetos, não acima deles como uma pasta-mãe.

## Fluxo Para Agentes

1. Ler `registry/projects.yml`.
2. Identificar o projeto ou conjunto de projetos relevantes.
3. Ler o card curto em `registry/projects/`.
4. Ler relações em `graph/relations.yml`.
5. Abrir o projeto real somente quando a tarefa exigir detalhes.
6. Atualizar o cérebro global apenas com resumo, relação ou decisão durável.

## Por Que Isso Economiza Tokens

Tokens são pedaços de texto que a IA precisa carregar para raciocinar.

Se o cérebro global guardar apenas resumos e ponteiros, a IA pode começar com
um mapa pequeno e só abrir os detalhes do projeto certo quando precisar.

## Regra De Escopo

Se a informação só importa para um projeto, ela deve ficar no projeto.

Se a informação conecta projetos ou governa o jeito de trabalhar, ela pode
ficar no Codex Brain.
