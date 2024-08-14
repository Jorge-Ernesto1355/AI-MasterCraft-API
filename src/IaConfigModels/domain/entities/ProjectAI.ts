import { IAModel } from "./IAModel";

class ProjectIa {
  private readonly projectName: string;
  private readonly description: string;
  private readonly config: any;
  private readonly organization: string;
  private readonly modelName: string;
  private readonly model: IAModel;
  private readonly IAType: string;
  private readonly userId: string;

  constructor(
    projectName: string,
    description: string,
    organization: string,
    modelName: string,
    config: any,
    IAType: string,
    userId: string
  ) {
    this.projectName = projectName;
    this.description = description;
    this.organization = organization;
    this.modelName = modelName;
    this.config = config;
    this.IAType = IAType;
    this.model = new IAModel(organization, modelName, config);
    this.userId = userId;
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

  public getIAType(): string {
    return this.IAType;
  }

  public run(prompt: string) {
    return this.model.run(prompt);
  }

  public getUserId(): string {
    return this.userId;
  }

  public toJSON() {
    return {
      projectName: this.projectName,
      description: this.description,
      organization: this.organization,
      modelName: this.modelName,
      config: this.config,
      IAType: this.IAType,
      userId: this.userId,
    };
  }
}

export default ProjectIa;
