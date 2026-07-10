export function nowIso(): string {
  return new Date().toISOString();
}

export function todayStamp(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function compactTimestamp(date = new Date()): string {
  return date.toISOString().replace(/[:.]/g, "-");
}
