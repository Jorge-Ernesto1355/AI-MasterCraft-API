import { Response } from "express";
import { Client } from "../entities/Client";
import { SSEEvent } from "../events/SSEEvent";

export interface IEventEmitter {
  emit(event: SSEEvent, client: Client): Promise<void>;
  emitToUser(event: SSEEvent, userId: string): Promise<void>;
  emitToAll(event: SSEEvent): Promise<void>;
  registerClient(clientId: string, response: Response): void;
}
