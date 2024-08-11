import Replicate from "replicate";
import {
  AbstractAIModel,
  AIModelInput,
  AIModelOutput,
} from "../../domain/entities/abstractAIModel";

import dotenv from "dotenv";

dotenv.config();

export class ReplicateAdapter extends AbstractAIModel {
  private readonly replicate: Replicate;

  constructor(organization: string, modelName: string) {
    super(organization, modelName);
    this.replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
  }

  public async generate(
    prompt: string,
    config: Record<string, unknown>
  ): Promise<AIModelOutput> {
    const input: AIModelInput = { prompt, config };
    return this.shouldUseStreaming() ? this.stream(input) : this.run(input);
  }

  shouldUseStreaming(): boolean {
    return ["meta", "mistralai"].some((org) => this.organization.includes(org));
  }

  prepareInput(input: AIModelInput): Record<string, unknown> {
    const { prompt, config } = input;

    if (this.modelName.includes("sdxl")) {
      return { prompt, ...config };
    }

    if (this.modelName.includes("llama")) {
      return { text: prompt, ...config };
    }

    return input;
  }

  async run(input: AIModelInput): Promise<AIModelOutput> {
    const preparedInput = this.prepareInput(input);
    return this.replicate.run(this.getModelString(), { input: preparedInput });
  }

  async stream(input: AIModelInput): Promise<AIModelOutput> {
    const preparedInput = this.prepareInput(input);
    let output = "";

    for await (const event of this.replicate.stream(this.getModelString(), {
      input: preparedInput,
    })) {
      const chunk = event.data.toString();
      output += chunk;
      process.stdout.write(chunk);
    }

    return { output };
  }

  getModelString(): `${string}/${string}` | `${string}/${string}:${string}` {
    return `${this.organization}/${this.modelName}` as `${string}/${string}`;
  }
}
