import { IAModel } from "./IAModel";

interface ProjectIaConfig {
  projectName: string;
  description: string;
  organization: string;
  modelName: string;
  config: any;
  IAType: string;
  userId: string;
  AImodelId: string;
}

class ProjectIa {
  private readonly model: IAModel;
  private readonly config: ProjectIaConfig;

  constructor(config: ProjectIaConfig) {
    this.config = config;
    this.model = new IAModel(
      config.AImodelId,
      config.organization,
      config.modelName,
      config.config
    );
  }

  public run(prompt: string) {
    return this.model.run(prompt);
  }

  public getModelToJson() {
    return {
      id: this.config.AImodelId,
      organization: this.config.organization,
      modelName: this.config.modelName,
      config: this.config.config,
    };
  }

  public toJSON() {
    return { ...this.config };
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
  get IAType(): string {
    return this.config.IAType;
  }
  get userId(): string {
    return this.config.userId;
  }
  get ModelId(): string {
    return this.config.AImodelId;
  }
}

export default ProjectIa;
