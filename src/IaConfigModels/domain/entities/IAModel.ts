import { ReplicateAdapter } from "../../infrastructure/ports/ReplicateAdapter";

export interface IAModelDTO {
  id: string;
  organization: string;
  config: object;
  modelName: string;
}

export class IAModel {
  private readonly organization: string;
  private readonly modelName: string;
  private readonly config: any;
  private readonly id: string;

  constructor(
    id: string,
    organization: string,
    modelName: string,
    config: any
  ) {
    this.organization = organization;
    this.modelName = modelName;
    this.config = config;
    this.id = id;
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
      organization: this.organization,
      modelName: this.modelName,
      config: this.config,
      id: this.id,
    };
  }
}
