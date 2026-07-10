# Decisions

## 2026-07-09 - Codex Brain nasce como CLI local-first

Contexto:
O objetivo e preservar memoria tecnica, decisoes e rastreabilidade das sessoes do Codex.

Decisao:
Construir primeiro uma CLI local-first com armazenamento em Markdown e JSONL.

Motivo:
CLI reduz superficie de seguranca, funciona em qualquer projeto e prova o fluxo antes de UI.

Alternativas consideradas:
- Dashboard web inicial.
- SaaS inicial.
- Banco externo.

Trade-offs:
- Menos visual no inicio.
- Mais simplicidade, privacidade e portabilidade.

Consequencias:
- Relatorios sao Markdown.
- Eventos ficam no repositorio/local do projeto.
- Integracoes futuras podem consumir esta base.

Como reverter:
Adicionar uma camada de UI ou storage no futuro sem remover os arquivos locais.

## 2026-07-09 - Next prompt vira skill de continuidade

Contexto:
O Codex Brain ja gera arquivos `next-prompt` em `.agent-brain/reports/`, mas o uso manual exige achar e colar o Markdown correto.

Decisao:
Criar a skill `next-prompt`, acionada por `/next-prompt` ou por pedidos como `prompt 4`, para localizar o arquivo certo e executar o conteudo como continuacao da sessao.

Motivo:
Reduzir atrito no fluxo diario sem criar servidor, dashboard ou dependencia externa.

Consequencias:
- O fluxo de continuidade continua local-first.
- Prompts antigos continuam preservados.
- Prompts numerados podem ser executados explicitamente quando Matheus pedir.
