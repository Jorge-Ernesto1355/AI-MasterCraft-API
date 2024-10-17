import path from "path";
import ProjectIa from "../../domain/entities/ProjectAI";
import { IA_NOT_FOUND, IA_NOT_FOUND_MSG } from "../../domain/IAErrors";
import { IARepository } from "../../domain/interfaces/IARepository.interface";
import { Project } from "../../domain/interfaces/Project.interface";
import { ProjectIaMapper } from "../mappers/projectIaMapper";
import AIModel from "./modelsAI";
import projectIASchema from "./ProjectIASchema";

export class IAMongoRepository implements IARepository {
  async getAvailableIA(modelType: string | undefined) {
    try {
      const normalizedModeltype = modelType?.trim().toLowerCase();

      if (!normalizedModeltype) return await this.getAllModels();

      const AIModels = await AIModel.find({
        modelType: { $regex: new RegExp(`^${normalizedModeltype}$`, "i") },
      });

      return AIModels;
    } catch (error) {
      throw error;
    }
  }

  async getAllModels(): Promise<Array<Object>> {
    try {
      const AIModels = await AIModel.find();
      return AIModels;
    } catch (error) {
      throw error;
    }
  }

  async getIAById(IdIA: string): Promise<ProjectIa | Error> {
    try {
      const projectIa = await projectIASchema.findById(IdIA);

      if (!projectIa) return new IA_NOT_FOUND(IA_NOT_FOUND_MSG);

      const AImodel = await AIModel.findById(projectIa.AImodelId);

      const projectToDomain = ProjectIaMapper.toDomain({
        ...projectIa.toObject(),
        ...AImodel?.toObject(),
      });

      return projectToDomain;
    } catch (error) {
      throw error;
    }
  }

  async save(project: Project): Promise<ProjectIa> {
    try {
      const { projectName, description, AImodelId, userId, config } = project;
      const newProject = await projectIASchema.create({
        projectName,
        description,
        AImodelId,
        userId,
        config,
      });

      const AImodelObject = await AIModel.findById(AImodelId);

      if (AImodelObject instanceof Error) throw new Error("AI model Error");

      await newProject.save();

      const entityModel = {
        ...newProject.toObject(),
        ...AImodelObject?.toObject(),
      };

      const projectToDomain = ProjectIaMapper.toDomain(entityModel);

      return projectToDomain;
    } catch (error) {
      throw error;
    }
  }

  async getProjects(userId: string): Promise<ProjectIa[]> {
    try {
      const projects = await projectIASchema
        .find({ userId })
        .populate("userId", ["name", "email", "username"])
        .populate("AImodelId", ["modelName", "organization", "imageUrl"]);

      if (projects.length <= 0) return [];
      const projectsToDomain = projects.map((project) => {
        return ProjectIaMapper.toDomain(project);
      });
      return projectsToDomain;
    } catch (error) {
      throw error;
    }
  }
}
