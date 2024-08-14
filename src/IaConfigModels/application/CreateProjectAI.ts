import { Request, Response } from "express";
import { Project } from "../domain/interfaces/Project.interface";
import { iaServiceFactory } from "../infrastructure/dependecies";
import { StatusCodes } from "http-status-codes";

export class CreateProjectAI {
  async run(req: Request, res: Response) {
    try {
      const { projectName, description, AImodelId, config } = req.body;
      this.validateArguments({
        projectName,
        description,
        config,
        AImodelId,
      });

      const IAService = await this.createIAService(req.params.userId);

      const newProjectAI = await IAService.save({
        projectName,
        description,
        config,
        AImodelId,
      });
      if (newProjectAI instanceof Error) throw new Error(newProjectAI.message);

      return res.status(StatusCodes.CREATED).json(newProjectAI);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  private async createIAService(userId: string) {
    const IAService = await iaServiceFactory.create(userId);
    if (IAService instanceof Error) {
      throw new Error(`Failed to create IAService: ${IAService.message}`);
    }
    return IAService;
  }

  private validateArguments({ projectName, description, AImodelId }: Project) {
    if (!projectName || !description || !AImodelId)
      throw new Error("Arguments must be defined");
  }

  private handleError(error: unknown, res: Response): Response {
    if (error instanceof Error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
}
