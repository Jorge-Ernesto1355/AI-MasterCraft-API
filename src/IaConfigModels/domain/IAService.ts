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
 

  async getAvailableIA(modelType: string | undefined): Promise<IAModelDTO[]> {
    try {
      const modelsAvaiabels = await this.IArepository.getAvailableIA(modelType);
      console.log(modelsAvaiabels)
     const modelsDTO = modelsAvaiabels.map((model)=> model.toJSON())
     return modelsDTO
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

 async  searchModelByName(search: string): Promise<IAModelDTO[]> {

     try {
      const models = await this.IArepository.searchByModelName(search)
      const modelsDTO = models.map((model)=> model.toJSON())
      return modelsDTO
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
      throw new Error("Something went wrong with the creation of service");
    }
  }
}
