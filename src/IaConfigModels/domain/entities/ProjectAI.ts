import { IAModel } from "./IAModel";

class ProjectIa {
  private readonly projectName: string;
  private readonly description: string;
  private readonly config: any;
  private readonly organization: string;
  private readonly modelName: string;
  private readonly model: IAModel;

  constructor(
    projectName: string,
    description: string,
    organization: string,
    modelName: string,
    config: any
  ) {
    this.projectName = projectName;
    this.description = description;
    this.organization = organization;
    this.modelName = modelName;
    this.config = config;
    this.model = new IAModel(organization, modelName, config);
  }

  public getProjectName(): string {
    return this.projectName;
  }

  public getDescription(): string {
    return this.description;
  }

  public getConfig(): any {
    return this.config;
  }

  public getOrganization(): string {
    return this.organization;
  }

  public getModelName(): string {
    return this.modelName;
  }

  public run(prompt: string) {
    return this.model.run(prompt);
  }

  public toJSON() {
    return {
      projectName: this.projectName,
      description: this.description,
      organization: this.organization,
      modelName: this.modelName,
      config: this.config,
    };
  }
}

export default ProjectIa;
