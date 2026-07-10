import { BrainEvent, readEventsForDate } from "./event-store.js";
import { todayStamp } from "../utils/time.js";

export function getTodayEvents(root: string, date = todayStamp()): BrainEvent[] {
  return readEventsForDate(root, date).sort((a, b) =>
    String(a.timestamp).localeCompare(String(b.timestamp)),
  );
}

export function getPrompts(events: BrainEvent[]): string[] {
  return events
    .filter((event) => event.event === "UserPromptSubmit")
    .map((event) => String(event.prompt ?? ""))
    .filter(Boolean);
}

export function getAssistantMessages(events: BrainEvent[]): string[] {
  return events
    .filter((event) => event.event === "Stop")
    .map((event) => String(event.last_assistant_message ?? ""))
    .filter(Boolean);
}

export function getToolEvents(events: BrainEvent[]): BrainEvent[] {
  return events.filter((event) => event.event === "PostToolUse");
}

export function getConflictEvents(events: BrainEvent[]): BrainEvent[] {
  return events.filter((event) => {
    const conflict = event.conflict_check as { severity?: string } | undefined;
    return conflict?.severity === "medium" || conflict?.severity === "high";
  });
}
