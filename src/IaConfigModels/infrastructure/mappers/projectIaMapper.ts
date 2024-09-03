import ProjectIa from "../../domain/entities/ProjectAI";

export class ProjectIaMapper {
  static toPersistence(projectIa: ProjectIa): any {
    return {
      projectName: projectIa.projectName,
      description: projectIa.description,
      organization: projectIa.organization,
      modelName: projectIa.modelName,
      IAType: projectIa.IAType,
      config: JSON.stringify(projectIa.configModel),
    };
  }

  static toDomain(entity: any): ProjectIa {
    return new ProjectIa({
      projectName: entity.projectName,
      description: entity.description,
      organization: entity.organization,
      modelName: entity.modelName,
      config: entity.config,
      IAType: entity.IAType,
      userId: entity.userId,
      AImodelId: entity.AImodelId,
    });
  }
}
