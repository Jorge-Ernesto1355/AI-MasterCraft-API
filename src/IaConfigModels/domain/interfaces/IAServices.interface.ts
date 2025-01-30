import { typeConfig } from "../../infrastructure/persistence/AIResponseConfiguration";
import { Project } from "./Project.interface";

export interface AIService {
  getById(projectId: string): Promise<Project | Error>;
  save(project: Project): Promise<Project>;
  getProjects(userId: string): Promise<Array<Project>>;
  getAvailableIA(AIType: string): Promise<Object>;
  searchModelByName(search: string): any;
  editConfigProject(
    projectId: string,
    typeConfig: typeConfig
  ): Promise<void | Error>;
}
