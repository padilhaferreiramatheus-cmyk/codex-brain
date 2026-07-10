const SECRET_PATTERNS: Array<[RegExp, string]> = [
  [/OPENAI_API_KEY\s*=\s*[^\s"']+/gi, "OPENAI_API_KEY=[REDACTED]"],
  [/sk-[A-Za-z0-9_-]{8,}/g, "sk-[REDACTED]"],
  [/ghp_[A-Za-z0-9_]{8,}/g, "ghp_[REDACTED]"],
  [/github_pat_[A-Za-z0-9_]{8,}/g, "github_pat_[REDACTED]"],
  [/(password|senha|token|api_key)\s*=\s*([^\s"'&]+)/gi, "$1=[REDACTED]"],
];

export function maskSecrets(value: string): string {
  return SECRET_PATTERNS.reduce(
    (current, [pattern, replacement]) => current.replace(pattern, replacement),
    value,
  );
}
