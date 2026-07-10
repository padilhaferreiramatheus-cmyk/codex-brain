export type ProgressScoreInput = {
  promptCount: number;
  toolUseCount: number;
  changedFileCount: number;
  hasReport: boolean;
  conflictCount: number;
};

export type ProgressScore = {
  score: number;
  reasons: string[];
};

export function scoreProgress(input: ProgressScoreInput): ProgressScore {
  let score = 0;
  const reasons: string[] = [];

  if (input.promptCount > 0) {
    score += 20;
    reasons.push("ha prompts capturados");
  }

  if (input.toolUseCount > 0) {
    score += 20;
    reasons.push("ha uso de ferramentas registrado");
  }

  if (input.changedFileCount > 0) {
    score += Math.min(30, input.changedFileCount * 6);
    reasons.push("Git mostra arquivos alterados");
  }

  if (input.hasReport) {
    score += 20;
    reasons.push("relatorio foi gerado");
  }

  if (input.conflictCount > 0) {
    score -= Math.min(25, input.conflictCount * 10);
    reasons.push("ha alertas de conflito");
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    reasons,
  };
}
