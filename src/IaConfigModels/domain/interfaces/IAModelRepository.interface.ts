import { AIModel } from "../entities/IAModel";

export interface IAModelRepository {
  findById(id: string): Promise<AIModel | null>;
  save(model: AIModel): Promise<void>;
}
