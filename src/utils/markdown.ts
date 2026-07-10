export function heading(level: number, text: string): string {
  return `${"#".repeat(level)} ${text}`;
}

export function bulletList(items: string[]): string {
  if (items.length === 0) {
    return "- Nenhum.";
  }

  return items.map((item) => `- ${item}`).join("\n");
}

export function fenced(value: string, language = ""): string {
  return `\`\`\`${language}\n${value.trim()}\n\`\`\``;
}

export function truncateForMarkdown(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}\n\n[conteudo truncado: ${value.length - maxLength} caracteres omitidos]`;
}
