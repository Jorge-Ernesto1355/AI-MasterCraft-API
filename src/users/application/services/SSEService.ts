import "reflect-metadata";
import { injectable, inject } from "tsyringe";
import { IClientRepository } from "../../domain/repositories/IClientRepository";
import { IEventEmitter } from "../../domain/services/IEventEmitter";
import { Client } from "../../domain/entities/Client";
import { SSEEvent, EventType } from "../../domain/events/SSEEvent";
import Logger from "../../../utilities/logger";
import { Response } from "express";

@injectable()
export class SSEService {
  private readonly heartbeatInterval: number = 30000; // 30 seconds
  private readonly heartbeatTimers: Map<string, NodeJS.Timer> = new Map();

  constructor(
    @inject("IClientRepository")
    private readonly clientRepository: IClientRepository,
    @inject("IEventEmitter") private readonly eventEmitter: IEventEmitter,
    @inject("Logger") private readonly logger: Logger
  ) {}

  async handleConnection(
    userId: string,
    response: Response
  ): Promise<Client | undefined> {
    try {
      // Create new client
      const client: Client = {
        id: crypto.randomUUID(),
        userId,
        connectionTime: new Date(),
        lastPingTime: new Date(),
      };

      // Set up connection
      await this.clientRepository.add(client);
      this.eventEmitter.registerClient(client.id, response);
      this.setupHeartbeat(client.id, response);
      this.logger.info("New client connected", { clientId: client.id, userId });

      return client;
    } catch (error) {
      this.logger.error("Error handling connection", { error, userId });
      response.end();
      return undefined;
    }
  }

  private setupHeartbeat(clientId: string, response: Response): void {
    const timer = setInterval(() => {
      try {
        response.write(": heartbeat\n\n");
      } catch (error) {
        this.logger.error("Heartbeat failed", { clientId, error });
        this.handleDisconnection(clientId);
      }
    }, this.heartbeatInterval);

    this.heartbeatTimers.set(clientId, timer);
  }

  private clearHeartbeat(clientId: string): void {
    const timer = this.heartbeatTimers.get(clientId);
    if (timer) {
      clearInterval(timer as NodeJS.Timeout);
      this.heartbeatTimers.delete(clientId);
    }
  }

  async handleDisconnection(clientId: string): Promise<void> {
    try {
      this.clearHeartbeat(clientId);
      await this.clientRepository.remove(clientId);
      this.logger.info("Client disconnected", { clientId });
    } catch (error) {
      this.logger.error("Error handling disconnection", { error, clientId });
    }
  }

  async sendAIProgress(
    userId: string,
    progress: number,
    message: string
  ): Promise<void> {
    const event: SSEEvent = {
      id: crypto.randomUUID(),
      type: "ai_progress" as EventType,
      data: {
        progress,
        message,
      },
      timestamp: new Date(),
    };

    this.logger.info("Sending AI progress", { userId, progress, message });
    await this.eventEmitter.emitToUser(event, userId);
    this.logger.info("Sended AI progress", { userId, progress, message });
  }

  async sendAIComplete(userId: string, result: unknown): Promise<void> {
    const event: SSEEvent = {
      id: crypto.randomUUID(),
      type: EventType.AI_COMPLETE,
      data: {
        message: result,
      },
      timestamp: new Date(),
    };
    await this.eventEmitter.emitToUser(event, userId);
  }

  async sendAIError(userId: string, error: string): Promise<void> {
    const event: SSEEvent = {
      id: crypto.randomUUID(),
      type: EventType.AI_ERROR,
      data: { error },
      timestamp: new Date(),
    };

    await this.eventEmitter.emitToUser(event, userId);
  }
}
