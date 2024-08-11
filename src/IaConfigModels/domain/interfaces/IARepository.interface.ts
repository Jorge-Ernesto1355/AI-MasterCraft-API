import ProjectIa from "../entities/ProjectAI";
import { Project } from "./Project.interface";

export interface IARepository {
  getIAById(IdIA: string): Promise<ProjectIa | Error>;
  save(project: Project): Promise<ProjectIa>;
}
