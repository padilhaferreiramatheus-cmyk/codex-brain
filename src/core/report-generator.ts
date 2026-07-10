import path from "node:path";
import { getBranch, getChangedFiles, getDiffStat, getHeadCommit, getStatusShort } from "./git.js";
import { getAssistantMessages, getConflictEvents, getPrompts, getTodayEvents, getToolEvents } from "./session-store.js";
import { scoreProgress } from "./progress-scorer.js";
import { readTextIfExists, uniqueFilePath, writeText } from "../utils/fs.js";
import { bulletList, fenced, truncateForMarkdown } from "../utils/markdown.js";
import { memoryPath, reportPath } from "../utils/paths.js";
import { todayStamp } from "../utils/time.js";

function firstLine(value: string, fallback: string): string {
  return value.trim().split(/\r?\n/)[0]?.trim() || fallback;
}

function eventLabel(value: unknown): string {
  return String(value ?? "").trim() || "nao informado";
}

function summarizePrompts(prompts: string[]): string[] {
  return prompts.map((prompt, index) => `${index + 1}. ${firstLine(prompt, "prompt vazio")}`);
}

function slugifyLabel(label?: string): string {
  if (!label?.trim()) {
    return "";
  }

  return label
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function labeledDate(date: string, label?: string): string {
  const slug = slugifyLabel(label);
  return slug ? `${date}-${slug}` : date;
}

export async function generateDailyReport(
  root: string,
  date = todayStamp(),
  label?: string,
): Promise<string> {
  const events = getTodayEvents(root, date);
  const prompts = getPrompts(events);
  const assistantMessages = getAssistantMessages(events);
  const tools = getToolEvents(events);
  const conflicts = getConflictEvents(events);
  const changedFiles = await getChangedFiles(root);
  const branch = await getBranch(root);
  const commit = await getHeadCommit(root);
  const gitStatus = await getStatusShort(root);
  const diffStat = await getDiffStat(root);
  const progress = scoreProgress({
    promptCount: prompts.length,
    toolUseCount: tools.length,
    changedFileCount: changedFiles.length,
    hasReport: true,
    conflictCount: conflicts.length,
  });

  const objective = firstLine(prompts[0] ?? "", "Nao detectado");
  const report = `# Codex Brain report - ${date}

## Projeto

- Nome: ${path.basename(root)}
- Caminho: ${root}
- Branch: ${branch}
- Commit atual: ${commit}
- Data: ${date}
${label ? `- Checkpoint: ${label}` : ""}

## Objetivo principal detectado

${objective}

## Resumo do dia

- Eventos capturados: ${events.length}
- Prompts enviados: ${prompts.length}
- Ferramentas/comandos registrados: ${tools.length}
- Arquivos alterados no Git: ${changedFiles.length}
- Alertas de conflito: ${conflicts.length}

## Prompts enviados

${summarizePrompts(prompts).join("\n") || "- Nenhum prompt capturado."}

## Respostas finais do Codex

${assistantMessages.map((message, index) => `${index + 1}. ${firstLine(message, "mensagem vazia")}`).join("\n") || "- Nenhuma resposta final capturada."}

## Ferramentas/comandos usados

${tools
  .map((event, index) => `${index + 1}. ${eventLabel(event.tool_name)} ${event.command ? `- ${eventLabel(event.command)}` : ""}`.trim())
  .join("\n") || "- Nenhuma ferramenta capturada."}

## Arquivos alterados

${bulletList(changedFiles)}

## Git status

${gitStatus ? fenced(gitStatus, "text") : "- Sem alteracoes detectadas ou nao e repo Git."}

## Git diff stat

${diffStat ? fenced(diffStat, "text") : "- Sem diff stat disponivel."}

## Promessa vs realidade

- O usuario pediu: ${firstLine(prompts.at(-1) ?? "", "nada capturado")}
- O Codex disse que fez: ${firstLine(assistantMessages.at(-1) ?? "", "nada capturado")}
- O Git mostra: ${changedFiles.length > 0 ? `${changedFiles.length} arquivo(s) alterado(s)` : "nenhuma alteracao rastreada"}

## Decisoes novas sugeridas

- Revisar se alguma mudanca de hoje deve entrar em .agent-brain/memory/DECISIONS.md.

## Possiveis conflitos

${conflicts
  .map((event) => {
    const conflict = event.conflict_check as { severity?: string; matchedTerms?: string[] } | undefined;
    return `- ${conflict?.severity ?? "unknown"}: ${(conflict?.matchedTerms ?? []).join(", ") || "sem termo"}`;
  })
  .join("\n") || "- Nenhum conflito medio/alto capturado."}

## Pendencias

- Confirmar se o relatorio reflete o estado real do Git.
- Rodar validacoes relevantes antes de encerrar a sessao.

## Riscos

- Relatorio ainda e heuristico e offline.
- Hooks dependem de revisao/confianca no Codex.
- Repos grandes podem exigir limites menores de diff/evento.

## Pontuacao de progresso

${progress.score}/100

Motivos:
${bulletList(progress.reasons)}

## Proximo melhor prompt

Use \`codex-brain next\` para gerar um prompt completo de continuidade.
`;

  const file = uniqueFilePath(reportPath(root, `${labeledDate(date, label)}-report.md`));
  writeText(file, report);
  return file;
}

export async function generateNextPrompt(
  root: string,
  date = todayStamp(),
  label?: string,
): Promise<string> {
  const events = getTodayEvents(root, date);
  const prompts = getPrompts(events);
  const conflicts = getConflictEvents(events);
  const changedFiles = await getChangedFiles(root);
  const branch = await getBranch(root);
  const commit = await getHeadCommit(root);
  const decisions = readTextIfExists(memoryPath(root, "DECISIONS.md"));
  const dontDo = readTextIfExists(memoryPath(root, "DONT_DO.md"));

  const prompt = `# Proximo prompt para Codex

Voce esta trabalhando no projeto ${path.basename(root)}.

Contexto resumido:
- Branch atual: ${branch}
- Commit atual: ${commit}
- Checkpoint: ${label || "sem label"}
- Ultimo objetivo detectado: ${firstLine(prompts.at(-1) ?? "", "nao detectado")}
- Eventos capturados hoje: ${events.length}
- Alertas de conflito medio/alto: ${conflicts.length}

Objetivo da proxima sessao:
Continuar a partir do estado real do Git, preservando as decisoes de memoria do projeto e validando as mudancas com comandos pequenos.

Arquivos relevantes:
${bulletList(changedFiles)}

Decisoes que nao podem ser quebradas:
${truncateForMarkdown(decisions || "Consulte .agent-brain/memory/DECISIONS.md.", 4000)}

Pendencias:
- Comparar o que foi prometido com o que o Git mostra.
- Atualizar memoria tecnica se houver nova decisao real.
- Rodar typecheck/build/testes relevantes.

Riscos:
- Nao assumir que uma resposta anterior do Codex corresponde ao diff real.
- Nao sobrescrever relatorios ou historico.
- Nao executar comandos perigosos.

Criterio de finalizacao:
- Mudancas implementadas em arquivos rastreaveis.
- Validacao executada ou limitacao explicada.
- Relatorio e/ou proximo prompt atualizados quando fizer sentido.

Comandos de teste sugeridos:
- npm run typecheck
- npm run build
- npm test
- codex-brain status

O que nao fazer:
${truncateForMarkdown(dontDo || "Consulte .agent-brain/memory/DONT_DO.md.", 4000)}
`;

  const file = uniqueFilePath(reportPath(root, `${labeledDate(date, label)}-next-prompt.md`));
  writeText(file, prompt);
  return file;
}
