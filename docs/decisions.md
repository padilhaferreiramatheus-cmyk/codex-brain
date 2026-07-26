# Decisões

## 2026-07-26 - Pivô De CLI Para Cérebro Global Federado

Status: aceita.

### Contexto

Codex Brain nasceu como uma CLI local-first para registrar sessões do Codex,
hooks, eventos, relatórios e next prompts.

Matheus avaliou que a ideia ficou complexa e pouco alinhada ao problema real.
O problema mais útil é organizar vários projetos, relações, skills, padrões de
documentação e regras de agentes sem misturar todos os arquivos em uma pasta.

### Decisão

Codex Brain deixa de ser uma CLI/npm package/hook installer e passa a ser um
cérebro global em arquivos.

O cérebro global guarda:

- registro dos projetos;
- relações entre projetos;
- regras globais de trabalho com agentes;
- padrões de documentação;
- skills/processos reutilizáveis;
- glossário compartilhado;
- decisões transversais;
- resumos controlados.

Ele não guarda cópias completas dos projetos.

### Organização Escolhida

Os projetos ficam como pastas irmãs em `C:\Projetos`.

Exemplo:

```text
C:\Projetos\
  CODEX BRAIN\
  ObraFlow\
  espcons\
  Vlog My Job\
```

### Alternativas Consideradas

- Colocar todos os projetos dentro da pasta `CODEX BRAIN`.
- Criar um cérebro completo separado para cada projeto.
- Manter a CLI antiga de relatórios e hooks.

### Consequências

- A implementação TypeScript, pacote npm, testes e hooks antigos deixam de ser o
  centro do projeto.
- O repositório passa a ser documentação viva e grafo simples.
- O contexto fica mais barato para IA porque começa por resumos e ponteiros.
- Dados privados continuam nos projetos de origem.

### Riscos

- O mapa pode ficar desatualizado se novos projetos não forem registrados.
- Relações vagas demais podem confundir agentes.
- Como o repositório pode ir para GitHub, o nível de privacidade precisa ser
  revisado antes de publicar.

### Regra Resultante

O projeto guarda os detalhes dele.

O Codex Brain guarda o mapa entre os projetos.
