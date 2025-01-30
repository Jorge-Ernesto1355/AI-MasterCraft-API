import { Client } from "../entities/Client";

export interface IClientRepository {
  add(client: Client): Promise<void>;
  remove(clientId: string): Promise<void>;
  getByUserId(userId: string): Promise<Client[]>;
  updateLastPingTime(clientId: string): Promise<void>;
}
