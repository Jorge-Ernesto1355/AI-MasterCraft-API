import ProjectIa from "../../domain/entities/ProjectAI";

export class ProjectIaMapper {
  static toPersistence(projectIa: ProjectIa): any {
    return {
      projectName: projectIa.getProjectName(),
      description: projectIa.getDescription(),
      organization: projectIa.getOrganization(),
      modelName: projectIa.getModelName(),
      config: JSON.stringify(projectIa.getConfig()),
    };
  }

  static toDomain(entity: any): ProjectIa {
    return new ProjectIa(
      entity.projectName,
      entity.description,
      entity.organization,
      entity.modelName,
      entity.config
    );
  }
}
