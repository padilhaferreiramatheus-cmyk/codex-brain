import path from "node:path";
import { brainPath, memoryPath } from "../utils/paths.js";
import { ensureDir, readTextIfExists, writeFileIfMissing, writeText } from "../utils/fs.js";

const AGENTS_SECTION_MARKER = "<!-- codex-brain-memory -->";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function createMemoryFiles(root: string, date: string): string[] {
  ensureDir(brainPath(root, "memory"));
  const created: string[] = [];

  const files: Record<string, string> = {
    "PROJECT_MEMORY.md": `# Project Memory

Projeto: ${path.basename(root)}

Codex Brain e uma ferramenta local-first para registrar sessoes do Codex, eventos, prompts, mudancas reais no Git, memoria tecnica e relatorios de continuidade.

## Estado atual

- CLI inicial em construcao.
- Armazenamento local em Markdown e JSONL.
- Sem banco externo, servidor, dashboard ou SaaS.

## Como usar

1. Rode \`codex-brain init\`.
2. Rode \`codex-brain install-hooks\`.
3. Revise e confie nos hooks pelo fluxo do Codex.
4. Use \`codex-brain report\` e \`codex-brain next\` para fechar e continuar sessoes.

## Decisoes principais

- Git e a fonte da verdade para o que realmente mudou.
- A primeira versao e offline e local-first.
- Hooks nao devem bloquear o Codex nesta fase.

## Proximos passos

- Validar comandos basicos.
- Simular hooks com stdin.
- Melhorar heuristicas de relatorio.
`,
    "DECISIONS.md": `# Decisions

## ${date} - Codex Brain nasce como CLI local-first

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
`,
    "DONT_DO.md": `# Do Not Do

- Nao enviar dados para servidor externo.
- Nao usar banco externo na primeira versao.
- Nao implementar dashboard antes da CLI funcionar.
- Nao implementar suporte a outros agentes antes do Codex estar solido.
- Nao usar modo perigoso como yolo ou danger-full-access por padrao.
- Nao apagar historico de eventos.
- Nao sobrescrever relatorios antigos sem preservar versao.
- Nao coletar tokens, chaves de API ou credenciais.
- Nao remover .agent-brain/, .codex/hooks.json ou .codex/hooks/ como "sujeira" sem pedido explicito do usuario.
`,
    "ROADMAP.md": `# Roadmap

## Fase 1 - CLI local funcional

- init
- doctor
- status
- memoria local

## Fase 2 - hooks Codex estaveis

- SessionStart
- UserPromptSubmit
- PostToolUse
- Stop

## Fase 3 - relatorios melhores

- promessa vs realidade
- conflitos
- next prompt

## Fase 4 - integracao opcional com Graphify

- somente apos a CLI estar estavel

## Fase 5 - extensao VS Code, se realmente valer

- apenas se o fluxo CLI provar valor

## Fase 6 - SaaS, apenas se virar produto

- sem pressa e sem comprometer local-first
`,
    "OPEN_QUESTIONS.md": `# Open Questions

- Qual formato final dos eventos normalizados?
- Quando vale gerar memoria automaticamente?
- Como comparar melhor promessa do Codex com diff real?
- Quais hooks devem poder bloquear no futuro?
`,
    "CONFLICTS.md": `# Conflicts

Nenhum conflito aceito ou detectado ainda.
`,
  };

  for (const [filename, content] of Object.entries(files)) {
    if (writeFileIfMissing(memoryPath(root, filename), content)) {
      created.push(memoryPath(root, filename));
    }
  }

  return created;
}

export function updateAgentsMd(root: string): "created" | "updated" | "unchanged" {
  const agentsPath = path.join(root, "AGENTS.md");
  const section = `${AGENTS_SECTION_MARKER}
## Codex Brain memory

Before making durable changes in this project, check the local memory files in:

- .agent-brain/memory/PROJECT_MEMORY.md
- .agent-brain/memory/DECISIONS.md
- .agent-brain/memory/DONT_DO.md
- .agent-brain/memory/ROADMAP.md
- .agent-brain/memory/OPEN_QUESTIONS.md
- .agent-brain/memory/CONFLICTS.md

Respect these files unless the user explicitly updates the project direction.

Codex Brain installed these project-local files intentionally:

- .agent-brain/
- .codex/hooks.json
- .codex/hooks/

Do not delete, revert, or "clean up" those paths just because they appear as Git changes.
Only remove them if Matheus explicitly asks to uninstall Codex Brain.

When Matheus types "/hooks", that means he wants to open Codex's hook review/trust flow.
Do not interpret "/hooks" as a request to delete hook files.
${AGENTS_SECTION_MARKER}
`;

  const existing = readTextIfExists(agentsPath);
  if (!existing) {
    writeText(agentsPath, `# Agent Instructions\n\n${section}`);
    return "created";
  }

  if (existing.includes(AGENTS_SECTION_MARKER)) {
    const pattern = new RegExp(
      `${escapeRegExp(AGENTS_SECTION_MARKER)}[\\s\\S]*?${escapeRegExp(AGENTS_SECTION_MARKER)}`,
    );
    const updated = existing.replace(pattern, section.trimEnd());
    if (updated === existing) {
      return "unchanged";
    }

    writeText(agentsPath, updated.endsWith("\n") ? updated : `${updated}\n`);
    return "updated";
  }

  writeText(agentsPath, `${existing.trimEnd()}\n\n${section}`);
  return "updated";
}
