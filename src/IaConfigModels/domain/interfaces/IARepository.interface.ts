import ProjectIa from "../entities/ProjectAI";
import { Project } from "./Project.interface";

export interface IARepository {
  getIAById(IdIA: string): Promise<ProjectIa | Error>;
  save(project: Project): Promise<ProjectIa>;
  getProjects(userId: string): Promise<ProjectIa[]>;
  getAvailableIA(AIType: string | undefined): any;
}
