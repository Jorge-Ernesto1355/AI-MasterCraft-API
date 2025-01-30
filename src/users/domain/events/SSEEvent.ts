export interface SSEEvent {
  id: string;
  type: EventType;
  data: unknown;
  timestamp: Date;
}

export enum EventType {
  connection_established = "connection_established",
  AI_STATUS = "ai_status",
  AI_PROGRESS = "ai_progress",
  AI_COMPLETE = "ai_complete",
  AI_ERROR = "ai_error",
  SYSTEM = "system",
}
