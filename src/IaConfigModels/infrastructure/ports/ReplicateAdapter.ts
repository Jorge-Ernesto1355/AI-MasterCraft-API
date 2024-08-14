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
    return ["meta", "mistralai"].some((org) => this.organization.includes(org));
  }

  prepareInput(input: AIModelInput): Record<string, unknown> {
    const { prompt, config } = input;

    return { prompt, ...config };
  }

  public async generate(
    prompt: string,
    config: Record<string, unknown>
  ): Promise<AIModelOutput> {
    const input: AIModelInput = { prompt, config };
    const rawOutput = await this.executeModel(input);
    return await this.outputStrategy.processOutput(rawOutput);
  }

  async executeModel(input: AIModelInput): Promise<any> {
    const preparedInput = this.prepareInput(input);
    const modelString = this.getModelString();

    if (this.shouldUseStreaming()) {
      this.outputStrategy = new StreamingOutputStrategy();
      return this.replicate.stream(modelString, { input: preparedInput });
    } else {
      return this.replicate.run(modelString, { input: preparedInput });
    }
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
