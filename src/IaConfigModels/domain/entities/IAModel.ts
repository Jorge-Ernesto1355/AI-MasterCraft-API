import { container } from "tsyringe";
import { ReplicateAdapter } from "../../infrastructure/ports/ReplicateAdapter";
import { IARequestContext } from "./ProjectAI";
import Replicate from "replicate";

export interface IAModelDTO {
  id?: string;
  organization: string;
  config: Record<string, any>;
  modelName: string;
  modelType: string;
  imageUrl: string;
}

export class IAModel {
  private readonly organization: string;
  private readonly modelName: string;
  private readonly modelType: string;
  private readonly config: Record<string, any>;
  private readonly id: string;
  private readonly imageUrl: string;

  constructor(props: IAModelDTO) {
    this.id = props.id ?? "";
    this.organization = props.organization;
    this.modelName = props.modelName;
    this.modelType = props.modelType;
    this.config = props.config;
    this.imageUrl = props.imageUrl;
  }

  async run(context: IARequestContext) {
    const replicateAdapterFactory = container.resolve<
      (organization: string, modelName: string) => ReplicateAdapter
    >("ReplicateAdapterFactory");
    const replicateAdapter = replicateAdapterFactory(
      this.organization,
      this.modelName
    );

    const output = await replicateAdapter.generate(context, this.config);

    return output;
  }

  public toJSON(): IAModelDTO {
    return {
      id: this.id,
      modelType: this.modelType,
      organization: this.organization,
      modelName: this.modelName,
      config: this.config,
      imageUrl: this.imageUrl,
    };
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getOrganization(): string {
    return this.organization;
  }

  getModelName(): string {
    return this.modelName;
  }

  getModelType(): string {
    return this.modelType;
  }

  getConfig(): Record<string, any> | undefined {
    return this.config;
  }

  getImageUrl(): string | undefined {
    return this.imageUrl;
  }
}
