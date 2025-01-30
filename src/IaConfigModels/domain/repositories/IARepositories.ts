import { inject, injectable } from "tsyringe";
import { IAModel } from "../entities/IAModel";
import ProjectIa from "../entities/ProjectAI";
import { IARepository as InterfaceIARepository } from "../interfaces/IARepository.interface";
import { Project } from "../interfaces/Project.interface";
import { typeConfig } from "../../infrastructure/persistence/AIResponseConfiguration";

@injectable()
export class IARepository implements InterfaceIARepository {
  constructor(
    @inject("IAMongoRepository")
    private readonly repository: InterfaceIARepository
  ) {}
  getAvailableIA(AIType: string): Promise<Array<IAModel>> {
    return this.repository.getAvailableIA(AIType);
  }
  getProjects(userId: string): Promise<Array<ProjectIa>> {
    return this.repository.getProjects(userId);
  }

  getIAById(IdIA: string): Promise<ProjectIa | Error> {
    return this.repository.getIAById(IdIA);
  }

  save(project: Project): Promise<ProjectIa> {
    return this.repository.save(project);
  }

  searchByModelName(search: string) {
    return this.repository.searchByModelName(search);
  }

  editConfigProject(
    projectId: string,
    typeConfig: typeConfig
  ): Promise<void | Error> {
    return this.repository.editConfigProject(projectId, typeConfig);
  }
}
