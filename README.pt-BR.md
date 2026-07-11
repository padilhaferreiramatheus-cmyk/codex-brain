# Codex Brain

[![CI](https://github.com/padilhaferreiramatheus-cmyk/codex-brain/actions/workflows/ci.yml/badge.svg)](https://github.com/padilhaferreiramatheus-cmyk/codex-brain/actions/workflows/ci.yml)
[![Licença: MIT](https://img.shields.io/badge/Licenca-MIT-yellow.svg)](LICENSE)
[![Node.js >=20](https://img.shields.io/badge/node-%3E%3D20-339933.svg)](package.json)

Leia em inglês: [README.md](README.md)

A camada de memória que faltava para desenvolvimento com Codex.

Codex anda rápido. Git mostra o que mudou. Codex Brain ajuda você a lembrar por que mudou.

Codex Brain é uma CLI local-first que captura contexto de sessões do Codex, prompts, uso de ferramentas, estado do Git, memória técnica do projeto e relatórios de continuidade. Assim, você consegue voltar para um código sem reconstruir toda a história pelo chat.

Sem sincronização em nuvem. Sem banco de dados. Sem dashboard. Sem telemetria. Apenas Markdown, JSONL, Git e um fluxo que mantém a intenção técnica perto do repositório.

## Por Que Existe

Sessões de programação com IA criam uma lacuna estranha:

- o usuário pediu uma coisa;
- o agente disse que fez outra;
- o repositório contém a única verdade que realmente importa.

Codex Brain transforma essa lacuna em um relatório legível. Cada sessão pode gerar um resumo de "promessa vs realidade" que compara:

- o que o usuário pediu;
- o que o Codex respondeu;
- o que o Git mostra que realmente mudou.

Isso dá a pessoas desenvolvedoras, mantenedores e equipes uma trilha leve de auditoria sem enviar contexto do projeto para um serviço externo.

## O Que Você Ganha

- Memória técnica local em `.agent-brain/memory/`
- Eventos brutos dos hooks salvos como JSONL
- Relatórios diários em Markdown
- Arquivos de next prompt para continuar sessoes
- `git status` e resumo de diff em cada relatório
- Alertas de conflito contra a memória do projeto
- Mascaramento de segredos e truncamento de payloads nos hooks
- Skill `/next-prompt` para continuar a partir do último prompt gerado

Codex Brain foi feito para aquele momento em que "acho que o agente corrigiu" não é suficiente.

## Início Rápido

Via npm:

```bash
npx codex-brain quickstart
```

Ou instalando globalmente:

```bash
npm install -g codex-brain
codex-brain quickstart
```

Durante desenvolvimento local:

```bash
npm install
npm run build
npm run quickstart
npm run smoke
```

No Windows PowerShell, use `npm.cmd` se a execution policy bloquear `npm`:

```powershell
npm.cmd run quickstart
npm.cmd run smoke
```

## Fluxo Diário

1. Entre na raiz do projeto.
2. Rode `codex-brain quickstart`.
3. Revise e confie nos hooks gerados dentro do Codex com `/hooks`.
4. Trabalhe normalmente com o Codex.
5. Rode `codex-brain checkpoint` quando quiser marcar um ponto do trabalho.
6. Rode `codex-brain daily` no fim da sessão.
7. Continue depois com o arquivo `next-prompt` gerado ou com a skill `/next-prompt`.

Se você estiver usando este checkout diretamente a partir de outro projeto:

```powershell
cd C:\Projetos\seu-projeto
& "C:\Projetos\CODEX BRAIN\codex-brain.cmd" quickstart
& "C:\Projetos\CODEX BRAIN\codex-brain.cmd" selftest
& "C:\Projetos\CODEX BRAIN\codex-brain.cmd" daily
& "C:\Projetos\CODEX BRAIN\codex-brain.cmd" checkpoint --label fechamento
```

Não rode `npm.cmd run quickstart` dentro de outro projeto, a menos que o `package.json` desse projeto defina esse script.

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

Para desenvolvimento dentro deste repositório:

```powershell
npm.cmd run dev -- quickstart
npm.cmd run dev -- selftest
npm.cmd run dev -- timeline
npm.cmd run dev -- daily
npm.cmd run dev -- checkpoint --label meio-dia
```

## Veja Em Ação

Comece pelos exemplos sanitizados:

- [Sessão demo](examples/demo-session.md)
- [Exemplo de relatório](examples/report.md)
- [Exemplo de next prompt](examples/next-prompt.md)
- [Exemplo de memória](examples/memory-snapshot.md)
- [Checklist de lançamento](docs/launch-checklist.md)

## Relatórios

Um relatório pode incluir:

- nome do projeto, branch, commit e data;
- objetivo detectado da sessão;
- prompts capturados no dia;
- respostas finais do Codex;
- ferramentas e comandos usados;
- arquivos alterados segundo o Git;
- `git status`;
- `git diff --stat`;
- promessa vs realidade;
- possíveis conflitos;
- riscos;
- pontuação de progresso;
- próximo melhor prompt.

Os relatórios são gerados em `.agent-brain/reports/`, que é tratado como saída local de runtime. Guarde os relatórios quando precisar deles; não publique por padrão.

## Hooks

`codex-brain install-hooks` cria hooks locais do Codex:

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
- mascaram padrões comuns de segredo;
- truncam payloads grandes;
- registram erros localmente;
- sempre saem com código `0`;
- não escrevem em stdout;
- não enviam dados para fora da sua máquina.

`/hooks` é um comando da interface do Codex, não um comando do PowerShell. Use dentro do Codex para inspecionar e confiar nos hooks locais.

## Armazenamento Local

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

Git continua sendo a fonte da verdade para o que mudou. Codex Brain adiciona o contexto em volta dessas mudanças.

## Privacidade E Segurança

Codex Brain é intencionalmente simples sobre dados.

- Sem servidor externo
- Sem banco de dados em nuvem
- Sem telemetria
- Sem chamadas de API para gerar relatórios
- Sem coleta de credenciais
- Sem modos perigosos do Codex por padrão

A primeira versão mascara padrões comuns como:

- `OPENAI_API_KEY`
- `sk-`
- `ghp_`
- `github_pat_`
- `password=`
- `senha=`
- `token=`
- `api_key=`

Evite usar `--dangerously-bypass-approvals-and-sandbox`, `--dangerously-bypass-hook-trust`, `danger-full-access` ou `yolo` como fluxo padrão.

## Para Quem É

Codex Brain é útil quando você:

- trabalha com Codex em sessões longas;
- volta para um repo dias depois e precisa recuperar o fio real;
- quer trilhas locais de auditoria de trabalho com IA sem SaaS;
- precisa de relatórios que comparem intenção contra Git;
- mantém vários projetos e quer continuidade leve;
- quer melhores handoffs entre humanos e agentes de código.

## O Que Ainda Não É

Codex Brain ainda é cedo.

- Não é um dashboard.
- Não é um SaaS.
- Não substitui Git.
- Não é uma plataforma multiagente.
- Não usa serviço externo de IA para escrever relatórios.

Essas restrições são deliberadas. O primeiro trabalho é tornar a CLI local confiável.

## Roadmap

1. CLI local confiável
2. Hooks estáveis para Codex
3. Relatórios melhores de promessa vs realidade
4. Integração opcional com Graphify
5. Extensão VS Code, se a CLI provar o fluxo
6. SaaS apenas se virar um produto real sem comprometer local-first

## Desenvolvimento

```bash
npm run typecheck
npm run build
npm test
```

Validações manuais:

```bash
npm run quickstart
npm run smoke
npm run dev -- doctor
npm run dev -- status
npm run dev -- timeline
npm run dev -- report
npm run dev -- next
```

## Solução De Problemas

Se o PowerShell bloquear `npm`, use:

```bash
npm.cmd -v
```

Se os hooks não rodarem, abra `/hooks` dentro do Codex e confirme que os comandos locais foram revisados e confiados.

Se `status` mostrar `not-a-git-repo`, inicialize Git no projeto ou rode Codex Brain dentro de um repositório existente.

## Contribuindo

Contribuições são bem-vindas enquanto o projeto permanecer focado: CLI confiável primeiro, local-first por padrão, segurança antes de espetáculo.

Leia [CONTRIBUTING.md](CONTRIBUTING.md) antes de abrir um pull request.

## Licença

MIT
