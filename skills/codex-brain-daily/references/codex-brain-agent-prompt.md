# Prompt Para Outro Codex

Voce esta trabalhando em um projeto onde o Codex Brain foi instalado.

## O que e Codex Brain

Codex Brain e uma CLI local-first criada por Matheus para acompanhar sessoes do OpenAI Codex. Ela registra eventos locais, prompts, uso de ferramentas, estado real do Git, memoria tecnica e relatorios Markdown.

A frase do produto e:

> Git mostra o que mudou. Codex Brain mostra por que mudou.

## Arquivos intencionais

Estes caminhos sao intencionais:

- `.agent-brain/`
- `.agent-brain/memory/`
- `.agent-brain/events/`
- `.agent-brain/reports/`
- `.codex/hooks.json`
- `.codex/hooks/`

Nao apague, reverta nem limpe esses caminhos so porque aparecem no Git. Remova apenas se Matheus pedir explicitamente para desinstalar o Codex Brain.

## O que e `/hooks`

`/hooks` e um slash command da interface interativa do Codex quando essa interface suporta revisao/confianca de hooks.

`/hooks` nao e comando do PowerShell.
`/hooks` nao e uma skill.
`/hooks` nao significa "apague a pasta .codex/hooks".

Quando Matheus diz `/hooks`, ele normalmente quer revisar/confiar nos hooks configurados em `.codex/hooks.json`.

## Hooks existentes

O projeto pode ter hooks de outras ferramentas, como Graphify. Preserve-os.

O `hooks.json` deve poder conter Graphify e Codex Brain juntos. Nao restaure o arquivo para conter apenas Graphify se o Codex Brain tambem estiver instalado.

## Como usar no PowerShell

No PowerShell, use:

```powershell
cd C:\Projetos\espcons
& "C:\Projetos\CODEX BRAIN\codex-brain.cmd" status
& "C:\Projetos\CODEX BRAIN\codex-brain.cmd" report
& "C:\Projetos\CODEX BRAIN\codex-brain.cmd" next
```

Preferencialmente, use o fluxo unico de checkpoint:

```powershell
& "C:\Projetos\CODEX BRAIN\codex-brain.cmd" checkpoint
& "C:\Projetos\CODEX BRAIN\codex-brain.cmd" checkpoint --label meio-dia
& "C:\Projetos\CODEX BRAIN\codex-brain.cmd" checkpoint --label fechamento
```

Esse comando executa o fluxo pratico do dia:

1. mostra status;
2. gera report;
3. gera next prompt.

`daily` ainda existe como alias/compatibilidade, mas o conceito correto e checkpoint, porque pode ser usado varias vezes no mesmo dia.

## Como agir

Se Matheus pedir para usar Codex Brain:

1. Nao mexa no ESPCONS Hub como se Codex Brain fosse feature do Hub.
2. Nao apague hooks.
3. Rode `codex-brain checkpoint` pelo launcher local.
4. Mostre onde o report e o next prompt foram gerados.
5. Explique qualquer limitacao de forma curta.

Se houver conflito entre "limpar sujeira" e preservar Codex Brain, preserve Codex Brain e pergunte antes de apagar.
