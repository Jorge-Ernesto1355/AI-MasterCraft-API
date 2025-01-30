import { Response } from "express";
import { IEventEmitter } from "../../domain/services/IEventEmitter";
import { SSEEvent } from "../../domain/events/SSEEvent";
import { IClientRepository } from "../../domain/repositories/IClientRepository";
import { Client } from "../../domain/entities/Client";
import Logger from "../../../utilities/logger";
import { inject, singleton } from "tsyringe";

@singleton()
export class SSEEventEmitter implements IEventEmitter {
  private static instance: SSEEventEmitter | null = null;
  private readonly clients: Map<string, Response> = new Map();
  private readonly heartbeatInterval: number = 30000; // 30 seconds
  private readonly heartbeatTimers: Map<string, NodeJS.Timer> = new Map();

  constructor(
    @inject("IClientRepository")
    private readonly clientRepository: IClientRepository,
    @inject("Logger") private readonly logger: Logger
  ) {
    if (SSEEventEmitter.instance) {
      return SSEEventEmitter.instance;
    }
    SSEEventEmitter.instance = this;
  }

  registerClient(clientId: string, response: Response): void {
    // Configure SSE headers
    // Set up connection
    this.clients.set(clientId, response);
    this.setupHeartbeat(clientId, response);

    // Handle client disconnect
    response.on("close", () => this.handleClientDisconnection(clientId));

    this.logger.info("Client registered", { clientId });

    // Send initial connection success event
  }

  private setupHeartbeat(clientId: string, response: Response): void {
    // Clear any existing heartbeat
    this.clearHeartbeat(clientId);

    // Set up new heartbeat
    const timer = setInterval(() => {
      try {
        response.write(": heartbeat\n\n");
      } catch (error) {
        this.logger.error("Heartbeat failed", { clientId, error });
        this.handleClientError(clientId);
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

  async emit(event: SSEEvent, client: Client): Promise<void> {
    const response = this.clients.get(client.id);

    if (!response) {
      this.logger.warn("Attempted to emit to non-existent client", {
        clientId: client.id,
        eventType: event.type,
      });
      return;
    }

    try {
      const message = this.formatEvent(event);
      response.write(message);
      await this.clientRepository.updateLastPingTime(client.id);
    } catch (error) {
      this.logger.error("Error emitting event", { error, clientId: client.id });
      await this.handleClientError(client.id);
    }
  }

  async emitToUser(event: SSEEvent, userId: string): Promise<void> {
    const clients = await this.clientRepository.getByUserId(userId);

    if (clients.length === 0) {
      this.logger.info("No active clients found for user", { userId });
      return;
    }

    this.logger.info("Emitting event to user", {
      userId,
      clientCount: clients.length,
      eventType: event.type,
    });

    await Promise.all(clients.map((client) => this.emit(event, client)));
  }

  async emitToAll(event: SSEEvent): Promise<void> {
    if (this.clients.size === 0) {
      this.logger.info("No clients connected, broadcast skipped");
      return;
    }

    this.logger.info("Broadcasting event to all clients", {
      clientCount: this.clients.size,
      eventType: event.type,
    });

    const promises = Array.from(this.clients.entries()).map(
      ([clientId, response]) => {
        try {
          const message = this.formatEvent(event);
          response.write(message);
        } catch (error) {
          this.logger.error("Error broadcasting event", { error, clientId });
          return this.handleClientError(clientId);
        }
      }
    );

    await Promise.all(promises);
  }

  private formatEvent(event: SSEEvent): string {
    let formatted = "";
    if (event.type) formatted += `event: ${event.type}\n`;
    if (event.id) formatted += `id: ${event.id}\n`;
    formatted += `data: ${JSON.stringify(event.data)}\n\n`;
    return formatted;
  }

  private async handleClientError(clientId: string): Promise<void> {
    const response = this.clients.get(clientId);
    if (response) {
      response.end();
      this.clearHeartbeat(clientId);
      this.clients.delete(clientId);
      await this.clientRepository.remove(clientId);
      this.logger.info("Client removed due to error", { clientId });
    }
  }

  private async handleClientDisconnection(clientId: string): Promise<void> {
    this.clearHeartbeat(clientId);
    this.clients.delete(clientId);
    await this.clientRepository.remove(clientId);
    this.logger.info("Client disconnected", { clientId });
  }
}
