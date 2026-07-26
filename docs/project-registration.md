# Como Registrar Um Projeto

## Passo 1: Adicionar Ao Registry

Edite `registry/projects.yml` com:

- `id`;
- `name`;
- `path`;
- `path_status`;
- `role`;
- `privacy`;
- `summary_file`.

## Passo 2: Criar Card

Crie um arquivo em `registry/projects/`.

Use `templates/project-card.md`.

## Passo 3: Registrar Relações

Se o projeto se conecta a outro, adicione uma entrada em `graph/relations.yml`.

## Passo 4: Evitar Cópia Excessiva

Não copie documentação inteira do projeto. Use resumo e caminhos.

## Checklist

- O caminho existe?
- O nível de privacidade está claro?
- O papel do projeto está claro?
- Há relação com outro projeto?
- Existe algo que não deveria ser publicado?
