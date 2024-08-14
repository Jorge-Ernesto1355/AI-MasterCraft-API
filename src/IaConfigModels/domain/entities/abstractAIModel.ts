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

export interface AIModelInput {
  prompt: string;
  config?: AIModelConfig;
}

export abstract class AbstractAIModel {
  constructor(
    protected readonly organization: string,
    protected readonly modelName: string
  ) {}

  protected abstract prepareInput(input: AIModelInput): Record<string, unknown>;

  abstract generate(
    prompt: string,
    config?: AIModelConfig
  ): Promise<AIModelOutput>;

  protected abstract executeModel(input: AIModelInput): Promise<AIModelOutput>;

  protected abstract stream(input: AIModelInput): Promise<AIModelOutput>;

  protected getModelString(): string {
    return `${this.organization}/${this.modelName}`;
  }

  protected shouldUseStreaming(): boolean {
    return ["meta", "mistralai"].some((org) =>
      this.organization.toLowerCase().includes(org)
    );
  }
}
