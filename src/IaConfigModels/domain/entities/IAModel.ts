import { ReplicateAdapter } from "../../infrastructure/ports/ReplicateAdapter";

export class IAModel {
  private readonly organization: string;
  private readonly modelName: string;
  private readonly config: any;

  constructor(organization: string, modelName: string, config: any) {
    this.organization = organization;
    this.modelName = modelName;
    this.config = config;
  }

  async run(prompt: string) {
    const replicateAdapter = new ReplicateAdapter(
      this.organization,
      this.modelName
    );
    return replicateAdapter.generate(prompt, this.config);
  }
}
