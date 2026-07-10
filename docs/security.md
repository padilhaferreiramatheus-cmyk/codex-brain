# Security

Seguranca e prioridade porque hooks rodam dentro do fluxo do Codex.

## Politica

- Nao enviar dados para servidor externo.
- Nao coletar tokens ou credenciais.
- Mascarar segredos provaveis.
- Truncar payloads grandes.
- Sair com code `0` nos hooks para nao quebrar o Codex.
- Registrar erros localmente.

## Padroes mascarados

- `OPENAI_API_KEY`
- `sk-`
- `ghp_`
- `github_pat_`
- `password=`
- `senha=`
- `token=`
- `api_key=`

## Hook trust

Hooks locais do Codex devem ser revisados pelo usuario. Use `/hooks` no Codex para inspecionar e confiar nos comandos.

## Coisas perigosas

Nao usar por padrao:

- `--dangerously-bypass-approvals-and-sandbox`
- `--dangerously-bypass-hook-trust`
- `danger-full-access`
- `yolo`
