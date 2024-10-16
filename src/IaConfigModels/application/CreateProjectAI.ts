import { Request, Response } from "express";
import { Project } from "../domain/interfaces/Project.interface";
import { iaServiceFactory } from "../infrastructure/dependecies";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../utilities/apiError";
import { ErrorMessage } from "../../utilities/ErrorMessage";

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
      throw new ApiError(ErrorMessage.ErrorServiceCreation);
    }
    return IAService;
  }

  private validateArguments({ projectName, description, AImodelId }: Project) {
    if (!projectName || !description || !AImodelId)
      throw new ApiError(ErrorMessage.ParametersMustBeDefined);
  }

  private handleError(error: unknown, res: Response): Response {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        status: "error",
        message: error.message,
        code: error.name,
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An unexpected error occurred",
      code: "InternalServerError",
    });
  }
}
