import Replicate from "replicate";
import {
  AbstractAIModel,
  AIModelInput,
  AIModelOutput,
} from "../../domain/entities/abstractAIModel";
import {
  DefaultOutputStrategy,
  OutputStrategy,
  StreamingOutputStrategy,
} from "./Strategy/StategyOutPut";
import dotenv from "dotenv";

dotenv.config();
export class ReplicateAdapter extends AbstractAIModel {
  protected stream(input: AIModelInput): Promise<AIModelOutput> {
    throw new Error("Method not implemented.");
  }
  private readonly replicate: Replicate;
  private outputStrategy: OutputStrategy;

  constructor(
    organization: string,
    modelName: string,
    outputStrategy?: OutputStrategy
  ) {
    super(organization, modelName);
    this.replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
    this.outputStrategy = outputStrategy || new DefaultOutputStrategy();
  }

  shouldUseStreaming(): boolean {
    return ["meta", "mistralai", "ibm-granite"].some((org) =>
      this.organization.includes(org)
    );
  }

  prepareInput(input: AIModelInput): Record<string, unknown> {
    const { prompt, config } = input;
    return {
      prompt,
      ...config,
      stream: this.shouldUseStreaming(), // Explicitly set streaming parameter
    };
  }

  public async generate(
    prompt: string,
    config: Record<string, unknown>
  ): Promise<AIModelOutput> {
    const input: AIModelInput = { prompt, config };

    if (this.shouldUseStreaming()) {
      return this.streamWithRetry(input);
    }

    const rawOutput = await this.executeModel(input);
    return await this.outputStrategy.processOutput(rawOutput);
  }

  private async streamWithRetry(
    input: AIModelInput,
    maxRetries: number = 3
  ): Promise<AIModelOutput> {
    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await this.handleStreamingOutput(input);
      } catch (error) {
        lastError = error;
        console.warn(`Streaming attempt ${attempt + 1} failed, retrying...`);
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (attempt + 1))
        );
      }
    }

    throw lastError;
  }

  private async handleStreamingOutput(
    input: AIModelInput
  ): Promise<AIModelOutput> {
    const preparedInput = this.prepareInput(input);
    const streamingStrategy = new StreamingOutputStrategy();

    const stream = await this.replicate.stream(this.getModelString(), {
      input: preparedInput,
    });

    return streamingStrategy.processOutput(stream);
  }

  async executeModel(input: AIModelInput): Promise<any> {
    const preparedInput = this.prepareInput(input);
    return this.replicate.run(this.getModelString(), { input: preparedInput });
  }

  getModelString(): `${string}/${string}` | `${string}/${string}:${string}` {
    return `${this.organization}/${this.modelName}` as `${string}/${string}`;
  }
}
