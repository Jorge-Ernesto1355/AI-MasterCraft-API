import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { iaServiceFactory } from "../infrastructure/dependecies";
import { ApiError } from "../../utilities/apiError";

export class GetProjects {
  async run(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;

      if (!userId) throw new ApiError("NotFoundParameters", "Parameters must be defined", StatusCodes.BAD_REQUEST)

      const IAService = await this.createIAService(userId);
      const projectIa = await IAService.getProjects(userId);

      return res.status(StatusCodes.OK).json(projectIa);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  private async createIAService(userId: string) {
    const IAService = await iaServiceFactory.create(userId);
    if (IAService instanceof Error) {
      throw new ApiError("ErrorCreateService", "Error creating service", StatusCodes.FAILED_DEPENDENCY)
    }
    return IAService;
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
