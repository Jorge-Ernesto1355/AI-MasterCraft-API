import { ReplicateAdapter } from "../../infrastructure/ports/ReplicateAdapter";

export interface IAModelDTO {
  id?: string;
  organization: string;
  config: object;
  modelName: string;
  modelType: string
}

export class IAModel {
  private readonly organization: string;
  private readonly modelName: string;
  private readonly modelType: string;
  private readonly config: any;
  private readonly id: string;

  constructor(
    id: string,
    organization: string,
    modelName: string,
    modelType: string,
    config: object
  ) {
    this.id = id;
    this.organization = organization;
    this.modelName = modelName;
    this.modelType = modelType;
    this.config = config;
  }

  async run(prompt: string) {
    const replicateAdapter = new ReplicateAdapter(
      this.organization,
      this.modelName
    );
    return {
      output: "hola este es mi primer mensaje si es que funciona",
    };
  }

  public toJSON() {
    return {
      id: this.id,
      modelType: this.modelType,
      organization: this.organization,
      modelName: this.modelName,
      config: this.config,
    };
  }
}
