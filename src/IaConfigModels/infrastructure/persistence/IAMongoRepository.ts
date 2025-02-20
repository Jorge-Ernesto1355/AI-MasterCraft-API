import { IAModel } from "../../domain/entities/IAModel";
import ProjectIa from "../../domain/entities/ProjectAI";
import { IA_NOT_FOUND, IA_NOT_FOUND_MSG } from "../../domain/IAErrors";
import { IARepository } from "../../domain/interfaces/IARepository.interface";
import { Project } from "../../domain/interfaces/Project.interface";
import { AImodelMapper } from "../mappers/AImodelMapper";
import { ProjectIaMapper } from "../mappers/projectIaMapper";
import {
  AIResponseConfigurations,
  typeConfig,
} from "./AIResponseConfiguration";
import AIModel from "./modelsAI";
import projectIASchema from "./ProjectIASchema";

export class IAMongoRepository implements IARepository {
  async getAvailableIA(modelType: string | undefined): Promise<IAModel[]> {
    try {
      const normalizedModeltype = modelType?.trim().toLowerCase();

      if (!normalizedModeltype) return await this.getAllModels();

      const AIModels = await AIModel.find({
        modelType: { $regex: new RegExp(`^${normalizedModeltype}$`, "i") },
      });

      const models = AIModels.map((model) => AImodelMapper.toDomain(model));
      return models as IAModel[];
    } catch (error) {
      throw error;
    }
  }

  async getAllModels(): Promise<IAModel[]> {
    try {
      const AIModels = await AIModel.find();

      const models = AImodelMapper.toDomainList(AIModels);

      return models;
    } catch (error) {
      throw error;
    }
  }

  async getIAById(IdIA: string): Promise<ProjectIa | Error> {
    try {
      const projectIa = await projectIASchema.findById(IdIA);

      if (!projectIa) return new IA_NOT_FOUND(IA_NOT_FOUND_MSG);

      const AImodel = await AIModel.findById(projectIa.modelId);

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
      const { projectName, description, modelId, userId, config } = project;

      const newProject = await projectIASchema.create({
        projectName,
        description,
        modelId,
        userId,
        config,
      });

      const populatedProject = await projectIASchema
        .findById(newProject._id)
        .populate({
          path: "modelId",
          select: ["modelName", "organization", "imageUrl"],
        })
        .populate({ path: "userId", select: "username" })
        .exec();

      if (!populatedProject) {
        throw new Error("Failed to populate project");
      }

      const projectToDomain = ProjectIaMapper.toDomain(
        populatedProject.toObject()
      );

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
        .populate("modelId", ["modelName", "organization", "imageUrl"]);

      if (projects.length <= 0) return [];
      const projectsToDomain = projects.map((project) => {
        return ProjectIaMapper.toDomain(project);
      });
      return projectsToDomain;
    } catch (error) {
      throw error;
    }
  }

  async searchByModelName(search: string): Promise<IAModel[]> {
    if (!search) return await this.getAllModels();

    const models = await AIModel.find({
      modelName: { $regex: new RegExp(search, "i") },
    });

    const modelsDomain = models.map((model) => AImodelMapper.toDomain(model));

    return modelsDomain;
  }

  async editConfigProject(
    projectId: string,
    typeConfig: typeConfig
  ): Promise<void | Error> {
    try {
      const project = await projectIASchema.findById(projectId);
     
      if (!project) throw new IA_NOT_FOUND(IA_NOT_FOUND_MSG);

      const AIconfig = AIResponseConfigurations[typeConfig];
      if (!AIconfig) throw new Error("not configuration available");

      await projectIASchema.updateOne(
        { _id: projectId },
        { $set: { config: AIconfig } }
      );
    } catch (error) {
      throw error;
    }
  }
}
