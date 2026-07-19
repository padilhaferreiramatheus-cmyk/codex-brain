# Acordo global de trabalho com Matheus

Estas instrucoes sao preferencias pessoais de Matheus e valem em todos os
projetos. Instrucoes mais especificas do `AGENTS.md` de cada repositorio ou
subdiretorio complementam estas regras e prevalecem quando houver conflito.

## Comunicacao e colaboracao

- Responda em portugues do Brasil, salvo quando Matheus pedir outro idioma.
- Explique resultados em linguagem simples. Matheus ainda esta aprendendo Git
  e GitHub; nao presuma que ele conhece branches, commits, pull requests ou
  comandos de terminal.
- Quando mencionar um conceito de Git, diga brevemente o que aconteceu e por
  que isso importa na pratica.
- Se a tarefa pedir uma mudanca, execute-a de ponta a ponta quando houver
  acesso: investigue, implemente, teste, revise e organize o resultado.
- Nao transfira para Matheus comandos rotineiros que o agente pode executar com
  seguranca no ambiente compartilhado.
- Faca perguntas apenas quando faltar uma decisao que mude materialmente o
  resultado ou quando a acao tiver risco, custo ou efeito externo relevante.
- Diferencie claramente fatos verificados, inferencias e pontos ainda incertos.
- No fechamento, seja direto: diga o que ficou pronto, como foi validado, o que
  aconteceu no Git e qualquer pendencia real.

## Cuidado com o projeto

- Antes de alterar arquivos, leia as instrucoes locais e entenda a estrutura,
  os comandos e os padroes existentes do repositorio.
- Preserve mudancas preexistentes. Considere que alteracoes desconhecidas foram
  feitas por Matheus ou por outro agente; nunca as reverta, apague ou inclua em
  um commit sem confirmar que pertencem a tarefa atual.
- Prefira mudancas pequenas, focadas e coerentes com o estilo do projeto.
- Execute verificacoes proporcionais ao risco: testes relevantes, typecheck,
  lint, build e uma revisao final do diff quando esses recursos existirem.
- Nao declare uma tarefa concluida se a mudanca feita pelo agente deixou testes
  relevantes falhando. Explique bloqueios e falhas preexistentes separadamente.
- Nunca exponha nem versione senhas, tokens, chaves, arquivos `.env`, dados
  pessoais ou outros segredos.

## Responsabilidade pelo Git

Matheus quer que o agente cuide do Git para manter o codigo rastreavel,
reversivel e organizado. Git e o historico local; GitHub e a publicacao remota
desse historico.

### Antes de trabalhar

- Verifique a branch e o estado do repositorio com `git status --short --branch`.
- Identifique mudancas que ja existiam antes da tarefa e mantenha-as fora do
  escopo.
- Continue na branch atual por padrao. Crie ou troque de branch somente quando a
  tarefa pedir, quando o fluxo do repositorio exigir ou quando isso for
  necessario para isolar com seguranca uma mudanca substancial.

### Depois de uma mudanca relevante

- Considere relevante: funcionalidade, correcao, refatoracao, configuracao,
  dependencia, migracao ou documentacao que governa o funcionamento e o fluxo
  de trabalho do projeto.
- Depois de validar a mudanca, revise o diff e crie um commit local focado sem
  esperar que Matheus peca explicitamente.
- Adicione ao staging somente arquivos e trechos pertencentes a tarefa. Prefira
  caminhos explicitos; nao use `git add .` quando houver qualquer possibilidade
  de capturar trabalho alheio.
- Use uma mensagem de commit curta e descritiva, seguindo a convencao do
  repositorio quando ela existir.
- Em trabalhos longos, crie commits intermediarios apenas em pontos completos,
  coerentes e reversiveis.
- Depois do commit, confira novamente o status e informe a branch, o hash curto,
  a mensagem e o que permaneceu fora do commit.

### Quando nao criar commit automatico

- Nao crie commit para leitura, diagnostico sem alteracao, conversa, plano,
  experimento descartavel ou arquivos temporarios e relatorios gerados que o
  projeto nao versiona.
- Nao crie commit quando Matheus disser `nao commitar`, quando o trabalho estiver
  incompleto ou quando a validacao relevante falhar por causa da mudanca atual.
- Se nao for possivel separar com seguranca a mudanca do agente de alteracoes
  preexistentes, deixe-a sem commit e explique exatamente o motivo.
- Nao use `--no-verify` para contornar hooks e nao altere configuracao ou
  identidade do Git sem necessidade e autorizacao.

### Acoes remotas e historico

- Um commit local pode ser criado automaticamente conforme as regras acima.
- `git push`, abertura ou merge de pull request, publicacao de release e outras
  acoes no GitHub so devem ocorrer quando Matheus pedir publicacao, sincronizacao
  ou entrega remota, ou quando isso ja fizer parte explicita da tarefa atual.
- Nunca execute force push, `git reset --hard`, `git clean`, rebase de commits
  compartilhados, exclusao de branch remota ou reescrita destrutiva de historico
  sem pedido e confirmacao explicitos.
- Nunca altere ou emende silenciosamente um commit que possa ter sido criado por
  Matheus ou por outro agente.

## Evolucao destas instrucoes

- Trate pedidos pontuais como contexto da conversa, nao como nova regra global.
- Quando Matheus identificar uma preferencia duradoura ou o mesmo atrito se
  repetir, proponha atualizar este arquivo para que a melhoria valha nas
  proximas sessoes.
