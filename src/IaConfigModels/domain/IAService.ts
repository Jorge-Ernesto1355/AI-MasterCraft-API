import { inject, injectable } from "tsyringe";
import { User, UserDTO } from "../../users/domain/entities/User";
import { NotFoundUser, NotFoundUserMsg } from "../../users/domain/ErrorsUser";
import { userRepository } from "../../users/domain/interfaces/userRepository.interface";
import { IAModelDTO } from "./entities/IAModel";

import ProjectIa from "./entities/ProjectAI";

import { IA_NOT_FOUND, IA_NOT_FOUND_MSG } from "./IAErrors";
import { IARepository } from "./interfaces/IARepository.interface";
import { AIService } from "./interfaces/IAServices.interface";
import { Project } from "./interfaces/Project.interface";
import { typeConfig } from "../infrastructure/persistence/AIResponseConfiguration";
import { HfInference } from "@huggingface/inference";
export interface createMessageProps {
  user: UserDTO | null;
  AImodel: IAModelDTO | null;
  output: any;
  prompt?: string;
  isIA: boolean;
  projectId: string;
}
@injectable()
export class IAService implements AIService {
  private readonly IArepository: IARepository;
  private user: User | null;

  constructor(IaRepository: IARepository, user: User | null) {
    this.IArepository = IaRepository;
    this.user = user;
  }

  async getAvailableIA(modelType: string | undefined): Promise<IAModelDTO[]> {
    try {
      const modelsAvaiabels = await this.IArepository.getAvailableIA(modelType);
      const modelsDTO = modelsAvaiabels.map((model) => model.toJSON());
      return modelsDTO;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error("something went wrong with projects");
    }
  }

  async getProjects(userId: string): Promise<Project[]> {
    try {
      const projects = await this.IArepository.getProjects(userId);
      const projectJson = projects.map((project) => project.toJSON());
      return projectJson;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error("something went wrong with projects");
    }
  }

  async getById(IdIA: string): Promise<Project | Error> {
    try {
      const projectIA = await this.getValidProjectIA(IdIA);
      return projectIA.toJSON();
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
      return new Error("Something went wrong with the project");
    }
  }

  async save(project: Omit<Project, "_id">): Promise<Project> {
    try {
      if (!this.user) {
        throw new Error("User is required to save a project");
      }
      const newProject = await this.IArepository.save({
        ...project,
        userId: this.user.getId(),
      });
      return newProject.toJSON();
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error("Something went wrong");
    }
  }

  private async getValidProjectIA(projectId: string): Promise<ProjectIa> {
    const projectIA = await this.IArepository.getIAById(projectId);
    if (projectIA instanceof IA_NOT_FOUND) {
      throw new Error(IA_NOT_FOUND_MSG);
    }
    if (!(projectIA instanceof ProjectIa)) {
      throw new Error("Invalid project");
    }
    return projectIA;
  }

  async searchModelByName(search: string): Promise<IAModelDTO[]> {
    try {
      const models = await this.IArepository.searchByModelName(search);
      const modelsDTO = models.map((model) => model.toJSON());
      return modelsDTO;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error("Something went wrong");
    }
  }

  async editConfigProject(
    projectId: string,
    typeConfig: typeConfig
  ): Promise<void | Error> {
    try {
      const project = await this.IArepository.getIAById(projectId);
      if (project instanceof IA_NOT_FOUND) throw new Error(IA_NOT_FOUND_MSG);

      await this.IArepository.editConfigProject(projectId, typeConfig);
    } catch (error) {
      if (error instanceof Error) {
        return new Error(
          "Something went wrong with the creation of service: " + error.message
        );
      }
      return new Error("Something went wrong with the creation of service");
    }
  }
}

@injectable()
export class IaServiceFactory {
  constructor(
    @inject("UserRepository") private readonly userRepository: userRepository,
    @inject("IARepository") private readonly IArepository: IARepository
  ) {}

  async create(userId?: string): Promise<IAService | Error> {
    try {
      let user: User | null = null;
      if (userId) {
        const fetchedUser = await this.userRepository.getUserById(userId);
        if (fetchedUser instanceof NotFoundUser) {
          throw new Error(NotFoundUserMsg);
        }
        user = fetchedUser;
      }
      return new IAService(this.IArepository, user);
    } catch (error) {
      if (error instanceof Error) {
        return new Error(
          "Something went wrong with the creation of service: " + error.message
        );
      }
      return new Error("Something went wrong with the creation of service");
    }
  }
}
