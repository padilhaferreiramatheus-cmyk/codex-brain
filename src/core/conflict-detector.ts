export type ConflictSeverity = "none" | "low" | "medium" | "high";

export type ConflictCheckResult = {
  severity: ConflictSeverity;
  matchedTerms: string[];
  reasons: string[];
  suggestions: string[];
};

type DangerousTerm = {
  term: string;
  severity: Exclude<ConflictSeverity, "none">;
  reason: string;
};

const DANGEROUS_TERMS: DangerousTerm[] = [
  { term: "refazer do zero", severity: "high", reason: "pede reinicio amplo sem preservar historico tecnico" },
  { term: "refazer tudo do zero", severity: "high", reason: "pede reinicio amplo sem preservar historico tecnico" },
  { term: "reescrever tudo", severity: "high", reason: "pede reescrita ampla com alto risco de regressao" },
  { term: "trocar arquitetura", severity: "medium", reason: "pode conflitar com decisoes arquiteturais anteriores" },
  { term: "ignora decisao anterior", severity: "high", reason: "pede ignorar memoria/decisoes do projeto" },
  { term: "sem teste", severity: "medium", reason: "reduz criterio minimo de validacao" },
  { term: "remove validacao", severity: "medium", reason: "pode reduzir seguranca ou qualidade dos dados" },
  { term: "bypass", severity: "medium", reason: "sugere contornar protecoes" },
  { term: "yolo", severity: "high", reason: "sugere execucao sem revisao adequada" },
  { term: "dangerously", severity: "high", reason: "termo associado a modos perigosos" },
  { term: "danger-full-access", severity: "high", reason: "modo amplo demais para o padrao seguro do projeto" },
  { term: "apagar historico", severity: "high", reason: "pode destruir rastreabilidade" },
  { term: "limpar tudo", severity: "medium", reason: "pode remover contexto ou memoria sem revisao" },
  { term: "remover seguranca", severity: "high", reason: "pede reduzir protecoes" },
  { term: "desativar permissao", severity: "high", reason: "pede contornar controle de permissao" },
  { term: "--dangerously-bypass-approvals-and-sandbox", severity: "high", reason: "flag perigosa explicitamente proibida por padrao" },
  { term: "--dangerously-bypass-hook-trust", severity: "high", reason: "bypassa confianca/revisao de hooks" },
];

const SEVERITY_RANK: Record<ConflictSeverity, number> = {
  none: 0,
  low: 1,
  medium: 2,
  high: 3,
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function maxSeverity(current: ConflictSeverity, candidate: ConflictSeverity): ConflictSeverity {
  return SEVERITY_RANK[candidate] > SEVERITY_RANK[current] ? candidate : current;
}

export function analyzePromptForConflicts(
  prompt: string,
  memoryTexts: string[] = [],
): ConflictCheckResult {
  const normalizedPrompt = normalize(prompt);
  const matchedTerms: string[] = [];
  const reasons: string[] = [];
  let severity: ConflictSeverity = "none";

  for (const item of DANGEROUS_TERMS) {
    if (normalizedPrompt.includes(normalize(item.term))) {
      matchedTerms.push(item.term);
      reasons.push(item.reason);
      severity = maxSeverity(severity, item.severity);
    }
  }

  const normalizedMemory = normalize(memoryTexts.join("\n"));
  const memoryConflictTerms = ["dashboard", "saas", "sqlite", "banco externo", "claude", "cursor", "windsurf", "cline"];

  for (const term of memoryConflictTerms) {
    if (normalizedPrompt.includes(term) && normalizedMemory.includes(term)) {
      matchedTerms.push(term);
      reasons.push(`o termo "${term}" aparece em memoria de restricoes/decisoes`);
      severity = maxSeverity(severity, "medium");
    }
  }

  const suggestions =
    severity === "none"
      ? []
      : [
          "Reformule o prompt para preservar decisoes existentes e pedir uma mudanca pequena.",
          "Inclua criterio de validacao e arquivos que podem ser alterados.",
          "Explique explicitamente que historico, seguranca e memoria tecnica devem ser preservados.",
        ];

  return {
    severity,
    matchedTerms: [...new Set(matchedTerms)],
    reasons: [...new Set(reasons)],
    suggestions,
  };
}
