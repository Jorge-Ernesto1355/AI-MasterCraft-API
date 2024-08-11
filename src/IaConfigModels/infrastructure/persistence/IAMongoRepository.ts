import ProjectIa from "../../domain/entities/ProjectAI";
import { IA_NOT_FOUND, IA_NOT_FOUND_MSG } from "../../domain/IAErrors";
import { IARepository } from "../../domain/interfaces/IARepository.interface";
import { Project } from "../../domain/interfaces/Project.interface";
import { ProjectIaMapper } from "../mappers/projectIaMapper";
import projectIASchema from "./ProjectIASchema";

export class IAMongoRepository implements IARepository {
  async getIAById(IdIA: string): Promise<ProjectIa | Error> {
    try {
      const projectIa = await projectIASchema.findById(IdIA);

      if (!projectIa) return new IA_NOT_FOUND(IA_NOT_FOUND_MSG);

      const projectToDomain = ProjectIaMapper.toDomain(projectIa);

      return projectToDomain;
    } catch (error) {
      throw error;
    }
  }

  async save(project: Project): Promise<ProjectIa> {
    try {
      const { projectName, description, organization, modelName, config } =
        project;
      const newProject = await projectIASchema.create({
        projectName,
        description,
        organization,
        modelName,
        config,
      });
      const savedProject = await newProject.save();
      const projectToDomain = ProjectIaMapper.toDomain(savedProject);
      return projectToDomain;
    } catch (error) {
      throw error;
    }
  }
}
