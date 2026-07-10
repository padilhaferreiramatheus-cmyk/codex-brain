# Codex Brain

Git mostra o que mudou. Codex Brain mostra por que mudou.

Codex Brain e uma CLI local-first para acompanhar sessoes de desenvolvimento com OpenAI Codex. Ela registra eventos, prompts, uso de ferramentas, estado real do Git, memoria tecnica do projeto e relatorios Markdown de continuidade.

Esta primeira versao e offline. Ela nao chama API externa, nao sobe servidor, nao cria dashboard e nao envia dados para nuvem.

## Problema que resolve

Codex ajuda a desenvolver, mas a intencao tecnica pode ficar perdida entre chat, arquivos alterados e memoria humana. O Codex Brain separa tres coisas:

- o que o usuario pediu;
- o que o Codex disse que fez;
- o que o Git mostra que mudou.

Essa separacao aparece na secao "Promessa vs realidade" dos relatorios.

## Instalacao local

Durante desenvolvimento:

```bash
npm install
npm run build
npm run quickstart
npm run smoke
```

Depois de publicado ou linkado como pacote:

```bash
codex-brain quickstart
codex-brain selftest
```

Se voce esta no Windows PowerShell e `npm` reclamar de execution policy, use `npm.cmd`:

```powershell
npm.cmd run quickstart
npm.cmd run smoke
```

## Comandos

```bash
codex-brain quickstart
codex-brain selftest
codex-brain init
codex-brain install-hooks
codex-brain doctor
codex-brain status
codex-brain timeline
codex-brain checkpoint
codex-brain checkpoint --label meio-dia
codex-brain checkpoint --label fechamento
codex-brain daily
codex-brain report
codex-brain next
codex-brain hooks-help
codex-brain conflict-check "refazer tudo do zero sem teste"
```

## Fluxo de uso

1. Entre na raiz do projeto.
2. Rode `codex-brain quickstart`.
3. Rode `codex-brain selftest` para ver o ciclo funcionando.
4. Abra o Codex e revise os hooks com `/hooks` dentro da interface do Codex.
5. Trabalhe normalmente.
6. Rode `codex-brain checkpoint` quando quiser marcar um ponto do trabalho.
7. Use `codex-brain checkpoint --label fechamento` no fim da sessao.
8. Use o arquivo `next-prompt` quando quiser continuar depois.

Durante desenvolvimento deste proprio repo, coloque `npm.cmd run dev --` antes do comando:

```powershell
npm.cmd run dev -- quickstart
npm.cmd run dev -- selftest
npm.cmd run dev -- timeline
npm.cmd run dev -- daily
npm.cmd run dev -- checkpoint --label meio-dia
```

Se voce quer usar esta copia local do Codex Brain em outro projeto antes de publicar/linkar o pacote, chame o launcher pelo caminho completo:

```powershell
cd C:\Projetos\espcons
& "C:\Projetos\CODEX BRAIN\codex-brain.cmd" quickstart
& "C:\Projetos\CODEX BRAIN\codex-brain.cmd" selftest
& "C:\Projetos\CODEX BRAIN\codex-brain.cmd" timeline
& "C:\Projetos\CODEX BRAIN\codex-brain.cmd" daily
& "C:\Projetos\CODEX BRAIN\codex-brain.cmd" checkpoint --label fechamento
```

Nao use `npm.cmd run quickstart` dentro de outro projeto, porque esse comando procura um script chamado `quickstart` no `package.json` daquele projeto.

## Hooks do Codex

`install-hooks` cria:

```text
.codex/
  hooks.json
  hooks/
    package.json
    README.md
    codex-brain-session-start.js
    codex-brain-user-prompt-submit.js
    codex-brain-post-tool-use.js
    codex-brain-stop.js
```

Os hooks:

- leem JSON do stdin;
- gravam eventos em `.agent-brain/events/raw/*.jsonl`;
- mascaram padroes simples de segredo;
- truncam payloads grandes;
- registram erros em `.agent-brain/events/raw/hook-errors.jsonl`;
- sempre saem com exit code `0`;
- nao escrevem em stdout;
- nao enviam dados para fora.

Importante: hooks locais do Codex precisam ser revisados e confiados pelo usuario. Use `/hooks` no Codex para inspecionar o que sera executado.

`/hooks` nao e comando do PowerShell. Se voce digitar `/hooks` no terminal, o Windows vai dizer que nao reconhece o comando. Isso e esperado. Abra o Codex e digite `/hooks` na interface do Codex.

Se o Codex interpretar `/hooks` como uma tarefa para apagar `.codex/hooks/`, pare a execucao. Esses arquivos sao intencionais. O objetivo de `/hooks` e abrir o fluxo de revisao/confianca dos hooks, nao limpar o repo.

## Estrutura local

```text
.agent-brain/
  config.json
  events/
    raw/
    normalized/
  sessions/
  reports/
  memory/
    PROJECT_MEMORY.md
    DECISIONS.md
    DONT_DO.md
    ROADMAP.md
    OPEN_QUESTIONS.md
    CONFLICTS.md
```

## Exemplo de report

Um report diario inclui:

- projeto, data, branch e commit;
- objetivo principal detectado;
- prompts enviados;
- respostas finais;
- ferramentas usadas;
- arquivos alterados;
- `git status`;
- `git diff --stat`;
- promessa vs realidade;
- conflitos;
- riscos;
- pontuacao de progresso;
- proximo melhor prompt.

## Seguranca

O Codex Brain nao deve coletar segredos. A primeira versao mascara padroes simples:

- `OPENAI_API_KEY`
- `sk-`
- `ghp_`
- `github_pat_`
- `password=`
- `senha=`
- `token=`
- `api_key=`

Nao use `--dangerously-bypass-approvals-and-sandbox`, `--dangerously-bypass-hook-trust`, `danger-full-access` ou `yolo` por padrao.

## Limitacoes da versao inicial

- Analise de conflitos e heuristica.
- Relatorios nao usam IA externa.
- Eventos normalizados ainda sao reservados para evolucao futura.
- `hooks.json` usa caminhos absolutos; se mover o projeto, rode `codex-brain install-hooks` novamente.
- Em repos grandes, diff completo nao e salvo por padrao.

## Roadmap

1. CLI local funcional.
2. Hooks Codex estaveis.
3. Relatorios melhores.
4. Integracao opcional com Graphify.
5. Extensao VS Code, se realmente valer.
6. SaaS, apenas se virar produto.

## Troubleshooting

Se `npm -v` falhar no PowerShell por execution policy, use:

```bash
npm.cmd -v
```

Se os hooks nao rodarem, abra `/hooks` no Codex e confirme se eles foram revisados/confiados.

Se `status` mostrar `not-a-git-repo`, inicialize Git no projeto ou rode a CLI dentro de um repo existente.
