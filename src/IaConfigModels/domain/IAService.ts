import { User, UserDTO } from "../../users/domain/entities/User";
import { NotFoundUser, NotFoundUserMsg } from "../../users/domain/ErrorsUser";
import { userRepository } from "../../users/domain/interfaces/userRepository.interface";
import { IAModelDTO } from "./entities/IAModel";
import { MessageDTO } from "./entities/Message";
import ProjectIa from "./entities/ProjectAI";

import { IA_NOT_FOUND, IA_NOT_FOUND_MSG } from "./IAErrors";
import { IARepository } from "./interfaces/IARepository.interface";
import { AIService } from "./interfaces/IAServices.interface";
import { Project } from "./interfaces/Project.interface";
import ContentFormatter from "./utils/ContentFormatter";

export interface createMessageProps {
  user: UserDTO | null;
  AImodel: IAModelDTO | null;
  output: any;
  prompt?: string;
  isIA: boolean;
  projectId: string;
}

export class IAService implements AIService {
  private readonly IArepository: IARepository;
  private user: User;
  private contentFormatter: ContentFormatter;

  constructor(IaRepository: IARepository, user: User) {
    this.IArepository = IaRepository;
    this.user = user;
    this.contentFormatter = new ContentFormatter();
  }
  async createMessage({
    user,
    AImodel,
    output,
    isIA,
    projectId,
  }: createMessageProps) {
    try {
      return await this.IArepository.createMessage({
        user,
        AImodel,
        output,
        isIA,
        projectId,
      });
    } catch (error) {
      throw error;
    }
  }

  async getAvailableIA(modelType: string | undefined): Promise<Array<Object>> {
    try {
      const modelsAvaiabels = await this.IArepository.getAvailableIA(modelType);
      return modelsAvaiabels;
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
  async generateIAMessage(
    projectId: string,
    prompt: string
  ): Promise<MessageDTO> {
    try {
      const projectIA = await this.getValidProjectIA(projectId);
      const outputIA = await projectIA.run(prompt);

      // creation of user message
      await this.createMessage({
        output: this.contentFormatter.format({ output: prompt }),
        user: this.user.toJSON(),
        isIA: false,
        AImodel: null,
        projectId,
      });

      return this.createMessage({
        output: this.contentFormatter.format(outputIA),
        isIA: true,
        user: null,
        AImodel: projectIA.getModelToJson(),
        projectId,
      });
    } catch (error) {
      this.handleError(error);
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

  private handleError(error: unknown): never {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Something went wrong");
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
      throw new Error("Something went wrong with the creation of service");
    }
  }
}
