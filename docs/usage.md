# Usage

## Jeito mais simples

Dentro de um projeto:

```bash
codex-brain quickstart
codex-brain selftest
```

Usando a copia local em `C:\Projetos\CODEX BRAIN` antes de instalar globalmente:

```powershell
cd C:\Projetos\espcons
& "C:\Projetos\CODEX BRAIN\codex-brain.cmd" quickstart
& "C:\Projetos\CODEX BRAIN\codex-brain.cmd" selftest
```

Nao rode `npm.cmd run quickstart` dentro de `espcons`, a menos que o `package.json` do `espcons` tenha esse script. Scripts npm pertencem ao projeto atual.

No repo de desenvolvimento do Codex Brain:

```powershell
npm.cmd run quickstart
npm.cmd run smoke
```

## O que acontece

`quickstart` cria a memoria local, instala hooks e roda o diagnostico.

`selftest` simula uma sessao do Codex, registra eventos, gera um report e gera um next prompt.

Depois disso:

```bash
codex-brain hooks-help
codex-brain timeline
codex-brain status
codex-brain checkpoint
codex-brain checkpoint --label meio-dia
codex-brain checkpoint --label fechamento
codex-brain daily
codex-brain report
codex-brain next
```

## Usando com Codex de verdade

1. Rode `codex-brain quickstart` na raiz do projeto.
2. Abra o Codex nesse projeto.
3. Dentro da interface do Codex, use `/hooks`.
4. Revise e confie nos hooks do Codex Brain.
5. Trabalhe normalmente.
6. Use `codex-brain checkpoint` sempre que quiser marcar um ponto do trabalho.
7. Use `codex-brain checkpoint --label fechamento` no fim da sessao.
8. Continue depois usando o arquivo `next-prompt` gerado.

Se o Codex responder a `/hooks` dizendo que vai apagar `.codex/hooks/` ou restaurar `.codex/hooks.json`, pare. Ele interpretou o texto como uma tarefa comum, nao como o fluxo de revisao de hooks. Esses arquivos fazem parte da instalacao do Codex Brain.

Nao digite `/hooks` no PowerShell. No PowerShell, use `codex-brain hooks-help` ou os comandos normais da CLI.
