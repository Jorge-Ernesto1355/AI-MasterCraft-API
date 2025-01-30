import { typeConfig } from "../../infrastructure/persistence/AIResponseConfiguration";
import { IAModel } from "../entities/IAModel";
import ProjectIa from "../entities/ProjectAI";
import { Project } from "./Project.interface";

export interface IARepository {
  getIAById(IdIA: string): Promise<ProjectIa | Error>;
  save(project: Omit<Project, "_id">): Promise<ProjectIa>;
  getProjects(userId: string): Promise<ProjectIa[]>;
  getAvailableIA(AIType: string | undefined): Promise<IAModel[]>;
  searchByModelName(search: string): Promise<IAModel[]>;
  editConfigProject(
    projectId: string,
    typeConfig: typeConfig
  ): Promise<void | Error>;
}
