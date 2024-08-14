import { User } from "../../users/domain/entities/User";
import { NotFoundUser, NotFoundUserMsg } from "../../users/domain/ErrorsUser";
import { userRepository } from "../../users/domain/interfaces/userRepository.interface";
import ProjectIa from "./entities/ProjectAI";

import { IA_NOT_FOUND, IA_NOT_FOUND_MSG } from "./IAErrors";
import { IARepository } from "./interfaces/IARepository.interface";
import { AIService } from "./interfaces/IAServices.interface";
import { Project } from "./interfaces/Project.interface";

export class IAService implements AIService {
  private readonly IArepository: IARepository;
  private user: User;

  constructor(IaRepository: IARepository, user: User) {
    this.IArepository = IaRepository;
    this.user = user;
  }
  async getAvailableIA(AIType: string): Promise<Array<Object>> {
    try {
      const modelsAvaiabels = await this.IArepository.getAvailableIA(AIType);
      return modelsAvaiabels;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);

      throw new Error("something went wrong with projects");
    }
  }
  async getProjects(userId: string): Promise<Array<Project>> {
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
      const IAProject = await this.IArepository.getIAById(IdIA);

      if (IAProject instanceof IA_NOT_FOUND) throw new Error(IA_NOT_FOUND_MSG);

      return IAProject.toJSON();
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);

      return new Error("Something went wrong with the project");
    }
  }

  async save(project: Project): Promise<Project> {
    try {
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

  async generateIA(projectId: string, prompt: string): Promise<Object> {
    try {
      const projectIA = await this.IArepository.getIAById(projectId);
      if (projectIA instanceof IA_NOT_FOUND) throw new Error(IA_NOT_FOUND_MSG);

      if (!(projectIA instanceof ProjectIa)) throw new Error("Invalid project");

      const outputIA = await projectIA.run(prompt);

      return outputIA;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);

      throw new Error("Something went wrong");
    }
  }
}

export class IaServiceFactory {
  constructor(
    private userRepository: userRepository,
    private IArepository: IARepository
  ) {
    (this.userRepository = userRepository), (this.IArepository = IArepository);
  }

  async create(userId: string): Promise<IAService | Error> {
    try {
      const user = await this.userRepository.getUserById(userId);
      if (user instanceof NotFoundUser) throw new Error(NotFoundUserMsg);

      return new IAService(this.IArepository, user);
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);

      throw new Error("Something went wrong with the project");
    }
  }
}
