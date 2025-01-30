import Logger from "../../../utilities/logger";
import Redis, { Redis as RedisInstance } from "ioredis";
import { injectable } from "tsyringe";

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
}

export const defaultRedisConfig: RedisConfig = {
  host: "127.0.0.1",
  port: 6379,
  password: undefined,
  db: 0,
};

@injectable()
export class RedisClient {
  private client: RedisInstance;

  constructor(private config: RedisConfig, private logger: Logger) {
    this.client = this.createClient();
    this.registerEvents();
  }

  private createClient(): RedisInstance {
    const { host, port, password, db } = this.config;
    return new Redis({
      host,
      port,
      password,
      db,
      retryStrategy: (times) => {
        this.logger.error(
          `Redis connection failed. Retrying in ${Math.min(
            times * 100,
            3000
          )}ms`
        );
        return Math.min(times * 100, 3000);
      },
    });
  }

  private registerEvents(): void {
    this.client.on("connect", () => this.logger.info("Redis connected"));
    this.client.on("ready", () => this.logger.info("Redis ready to use"));
    this.client.on("error", (err) => this.logger.error("Redis error:", err));
    this.client.on("close", () => this.logger.warn("Redis connection closed"));
    this.client.on("reconnecting", () =>
      this.logger.info("Redis reconnecting...")
    );
  }

  public getClient(): RedisInstance {
    return this.client;
  }

  public async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.set(key, value, "EX", ttl);
    } else {
      await this.client.set(key, value);
    }
  }

  public async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  public async delete(key: string): Promise<number> {
    return this.client.del(key);
  }

  public async disconnect(): Promise<void> {
    await this.client.quit();
    this.logger.info("Redis client disconnected");
  }
  public async deleteAll(): Promise<void> {
    try {
      await this.client.flushdb(); // Elimina todas las claves en la base de datos actual
      this.logger.info("All keys deleted from Redis database");
    } catch (error) {
      this.logger.error("Failed to delete all keys from Redis:", error);
      throw error; // Lanza el error si quieres que el cliente maneje esta excepción
    }
  }
}
