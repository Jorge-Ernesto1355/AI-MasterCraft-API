import { IAModel } from "./IAModel";

interface ProjectIaConfig {
  _id: string;
  projectName: string;
  description: string;
  organization: string;
  modelName: string;
  config: any;
  modelType: string;
  userId: string;
  modelId: string;
}

class ProjectIa {
  private readonly model: IAModel;
  private readonly config: ProjectIaConfig;
  _id: any;

  constructor(config: ProjectIaConfig) {
    this.config = config;
    this.model = new IAModel({
      id: config._id,
      modelName: config.modelName,
      modelType: config.modelType,
      organization: config.organization,
      config: config.config,
      imageUrl: "",
    });
  }

  public run(prompt: string) {
    return this.model.run(prompt);
  }

  public getModelToJson() {
    return {
      _id: this.config.modelId,
      organization: this.config.organization,
      modelName: this.config.modelName,
      config: this.config.config,
    };
  }

  public toJSON() {
    return {
      _id: this.config._id,
      projectName: this.config.projectName,
      description: this.config.description,
      user: this.config.userId,
      model: this.config.modelId,
    };
  }

  // Getters
  get projectName(): string {
    return this.config.projectName;
  }
  get description(): string {
    return this.config.description;
  }
  get organization(): string {
    return this.config.organization;
  }
  get modelName(): string {
    return this.config.modelName;
  }
  get configModel(): string {
    return this.config.config;
  }
  get modelType(): string {
    return this.config.modelType;
  }
  get userId(): string {
    return this.config.userId;
  }
  get ModelId(): string {
    return this.config.modelId;
  }
}

export default ProjectIa;
