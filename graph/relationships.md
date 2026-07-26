# Relações Entre Projetos

Este arquivo é a visão humana do grafo.

O arquivo estruturado para agentes é `relations.yml`.

## Mapa Inicial

```mermaid
graph TD
  CB["Codex Brain"] -->|"registra e organiza"| O["ObraFlow"]
  CB -->|"registra e organiza"| E["ESPCONS"]
  CB -->|"registra e organiza"| V["Vlog My Job"]
  CB -->|"registra e organiza"| EC["Espaço da Construção"]
  CB -->|"registra e organiza"| P["Pessoal"]

  V -->|"gera audiência para"| O
  EC -->|"fornece casos reais para"| V
  EC -->|"revela dores que podem virar produto"| O
  E -->|"fornece processos e sistemas reais para"| O
  E -->|"pode gerar histórias sanitizadas para"| V
  P -->|"define preferências e objetivos de"| CB
```

## Leitura Rápida

- Vlog My Job é distribuição e audiência.
- ObraFlow é produto.
- ESPCONS é operação e sistemas reais.
- Espaço da Construção é experiência prática e casos do setor.
- Pessoal é contexto de Matheus, sensível por padrão.
- Codex Brain é o mapa que ajuda a IA a escolher contexto sem carregar tudo.

## Regra Do Grafo

Uma relação deve ser curta, verificável e útil para ação.

Exemplo bom:

`Vlog My Job -> gera audiência para -> ObraFlow`

Exemplo ruim:

`Tudo se conecta com tudo`
