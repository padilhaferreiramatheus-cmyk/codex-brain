# Development Process

Este projeto usa um fluxo parecido com Architecture Review Board antes de mudancas relevantes.

## Papeis

- Architect: escopo, fluxo e trade-offs.
- Senior Engineer: estrutura, modularidade e simplicidade.
- Security Engineer: hooks, segredos e comandos perigosos.
- Performance Engineer: limites de payload, diff e JSONL.
- QA Engineer: typecheck, build, testes e validacao manual.
- Knowledge Manager: README, docs e memoria.

## Regras

- Fazer mudancas pequenas.
- Preservar local-first.
- Nao implementar dashboard antes da CLI funcionar.
- Nao enviar dados para fora.
- Nao quebrar historico de eventos.
