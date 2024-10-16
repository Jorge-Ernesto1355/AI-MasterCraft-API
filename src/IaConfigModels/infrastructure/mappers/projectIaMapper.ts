import ProjectIa from "../../domain/entities/ProjectAI";

export class ProjectIaMapper {
  static toPersistence(projectIa: ProjectIa): any {
    return {
      projectName: projectIa.projectName,
      description: projectIa.description,
      organization: projectIa.organization,
      modelName: projectIa.modelName,
      modelType: projectIa.modelType,
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
      modelType: entity.modelType,
      userId: entity.userId,
      AImodelId: entity.AImodelId,
    });
  }
}
