# Padrões De Documentação

## Arquivos Recomendados Por Projeto

Cada projeto pode ter:

- `README.md`: visão geral e como rodar.
- `AGENTS.md`: regras locais para agentes.
- `docs/decisions.md`: decisões duráveis.
- `docs/architecture.md`: arquitetura quando houver código.
- `docs/roadmap.md`: próximos passos.
- `docs/glossary.md`: termos do domínio.

## Estilo

- Escrever para humanos e agentes.
- Preferir frases curtas.
- Separar fato, hipótese e decisão.
- Evitar duplicar documentação que já existe em outro lugar.
- Usar links ou caminhos locais quando o detalhe completo estiver em outro
  projeto.

## Decisões

Uma decisão durável deve registrar:

- data;
- contexto;
- decisão;
- alternativas consideradas;
- consequências;
- riscos;
- como revisar ou desfazer.

Use `templates/decision-record.md`.

## Cards De Projeto

Cards em `registry/projects/` devem ser curtos. Eles não substituem a
documentação local do projeto.
