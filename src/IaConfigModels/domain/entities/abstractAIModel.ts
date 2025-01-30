import { prototype } from "events";
import {
  DefaultOutputStrategy,
  OutputStrategy,
} from "../../infrastructure/ports/Strategy/StategyOutPut";
import { SSEService } from "../../../users/application/services/SSEService";
import { IARequestContext } from "./ProjectAI";

export interface AIModelInput {
  [key: string]: any;
}

export interface AIModelOutput {
  output: string;
  stream?: AsyncGenerator<string, void, unknown>;
}

export interface AIModelConfig {
  [key: string]: unknown;
}

export abstract class AbstractAIModel {
  constructor(
    protected outputStrategy: OutputStrategy = new DefaultOutputStrategy(),
    protected readonly sseService: SSEService,
    protected readonly organization: string,
    protected readonly modelName: string
  ) {}

  protected abstract prepareInput(input: AIModelInput): Record<string, unknown>;

  abstract generate(
    context: IARequestContext,
    config?: AIModelConfig
  ): Promise<AIModelOutput>;

  protected abstract executeModel(input: AIModelInput): Promise<AIModelOutput>;

  protected getModelString(): string {
    return `${this.organization}/${this.modelName}`;
  }

  protected shouldUseStreaming(): boolean {
    return ["meta", "mistralai"].some((org) =>
      this.organization.toLowerCase().includes(org)
    );
  }
}
