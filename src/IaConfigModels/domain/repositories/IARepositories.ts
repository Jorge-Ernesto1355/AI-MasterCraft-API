import ProjectIa from "../entities/ProjectAI";
import { IARepository as InterfaceIARepository } from "../interfaces/IARepository.interface";
import { Project } from "../interfaces/Project.interface";

export class IARepository implements InterfaceIARepository {
  private readonly repository: InterfaceIARepository;

  constructor(repository: InterfaceIARepository) {
    this.repository = repository;
  }

  getIAById(IdIA: string): Promise<ProjectIa | Error> {
    return this.repository.getIAById(IdIA);
  }

  save(project: Project): Promise<ProjectIa> {
    return this.repository.save(project);
  }
}
