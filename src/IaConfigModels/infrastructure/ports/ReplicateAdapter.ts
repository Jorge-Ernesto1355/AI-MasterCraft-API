import "reflect-metadata";
import Replicate from "replicate";
import {
  AIModelInput,
  AIModelOutput,
} from "../../domain/entities/abstractAIModel";
import {
  DefaultOutputStrategy,
  OutputStrategy,
  streamingOutputStrategy,
} from "./Strategy/StategyOutPut";
import dotenv from "dotenv";
import { inject, injectable } from "tsyringe";
import { SSEService } from "../../../users/application/services/SSEService";
import { IARequestContext } from "../../domain/entities/ProjectAI";

dotenv.config();
@injectable()
export class ReplicateAdapter {
  private readonly replicate: Replicate;
  private readonly organization: string;
  private readonly modelName: string;

  constructor(
    @inject("OutputStrategy")
    private outputStrategy: OutputStrategy = new DefaultOutputStrategy(),
    @inject("SSEService") private sseService: SSEService,
    organization: string,
    modelName: string
  ) {
    this.replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
    this.organization = organization;
    this.modelName = modelName;
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
    context: IARequestContext,
    config: Record<string, unknown>
  ): Promise<AIModelOutput> {
    const input: AIModelInput = { ...context, config };

    if (this.shouldUseStreaming()) {
      const streamingOutput = await this.streamWithRetry(input);

      return streamingOutput;
    }

    const rawOutput = await this.executeModel(input);

    return await this.outputStrategy.processOutput(rawOutput as any);
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
    const streamingStrategy = new streamingOutputStrategy();
    const output = this.replicate.stream(this.getModelString(), {
      input: preparedInput,
    });

    let contentArray: string = "";
    let lastChunk: string = "";
    let isComplete = false;

    const stream = streamingStrategy.createSSEStream(output);
    await stream.pipeTo(
      new WritableStream({
        write: async (chunk) => {
          const parsedChunk = streamingStrategy.parseSSEChunk(chunk);

          if (parsedChunk) {
            contentArray = contentArray + parsedChunk.data;
            lastChunk = parsedChunk.data; // Store the last chunk separately
            await this.sseService?.sendAIProgress(
              input.userId,
              1,
              parsedChunk.data
            );
          }
        },
        close: async () => {
          await this.sseService?.sendAIComplete(input.userId, lastChunk); // Send only the last chunk
          isComplete = true;
        },
      })
    );

    if (isComplete) {
      return { output: contentArray }; // Return only the last chunk
    }

    return { output: contentArray }; // Return only the last chunk in case of early return
  }
  async executeModel(input: AIModelInput): Promise<any> {
    const preparedInput = this.prepareInput(input);
    return this.replicate.run(this.getModelString(), { input: preparedInput });
  }

  getModelString(): `${string}/${string}` | `${string}/${string}:${string}` {
    return `${this.organization}/${this.modelName}` as `${string}/${string}`;
  }
}
