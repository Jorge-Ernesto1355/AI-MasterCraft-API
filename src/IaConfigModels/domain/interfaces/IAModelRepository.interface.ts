import { AIModel } from "../entities/IAModel";

export interface IAModelRepository {
  findById(id: string): Promise<AIMode | null>;
  save(model: AIModel): Promise<void>;
}
