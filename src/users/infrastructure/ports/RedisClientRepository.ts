import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../domain/repositories/IClientRepository";
import { Client } from "../../domain/entities/Client";
import { RedisClient } from "../persistence/Redis";

@injectable()
export class RedisClientRepository implements IClientRepository {
  constructor(
    @inject("RedisClient") private readonly redisClient: RedisClient
  ) {}

  async add(client: Client): Promise<void> {
    this.redisClient.deleteAll();
    // Almacenar cliente en Redis
    await this.redisClient.getClient().hset(`clients:${client.id}`, {
      userId: client.userId,
      connectionTime: client.connectionTime.toISOString(),
      lastPingTime: client.lastPingTime.toISOString(),
    });

    // Relación usuario -> clientes
    await this.redisClient
      .getClient()
      .sadd(`user:${client.userId}:clients`, client.id);
  }

  async remove(clientId: string): Promise<void> {
    const client = await this.redisClient
      .getClient()
      .hgetall(`clients:${clientId}`);
    if (client.userId) {
      // Eliminar relación usuario -> cliente
      await this.redisClient
        .getClient()
        .srem(`user:${client.userId}:clients`, clientId);
    }
    // Eliminar el cliente
    await this.redisClient.getClient().del(`clients:${clientId}`);
  }

  async getByUserId(userId: string): Promise<Client[]> {
    const clientIds = await this.redisClient
      .getClient()
      .smembers(`user:${userId}:clients`);
    const clients: Client[] = [];

    for (const clientId of clientIds) {
      const clientData = await this.redisClient
        .getClient()
        .hgetall(`clients:${clientId}`);
      if (clientData) {
        clients.push({
          id: clientId,
          userId: clientData.userId,
          connectionTime: new Date(clientData.connectionTime),
          lastPingTime: new Date(clientData.lastPingTime),
        });
      }
    }

    return clients;
  }

  async updateLastPingTime(clientId: string): Promise<void> {
    await this.redisClient
      .getClient()
      .hset(`clients:${clientId}`, "lastPingTime", new Date().toISOString());
  }
}
