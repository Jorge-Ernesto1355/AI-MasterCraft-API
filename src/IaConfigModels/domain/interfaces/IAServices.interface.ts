import { Project } from "./Project.interface";

export interface AIService {
  getById(projectId: string): Promise<Project | Error>;
  save(project: Project): Promise<Project>;
  generateIA(projectId: string, prompt: string): Promise<Object>;
  getProjects(userId: string): Promise<Array<Project>>;
  getAvailableIA(AIType: string): Promise<Object>;
}
