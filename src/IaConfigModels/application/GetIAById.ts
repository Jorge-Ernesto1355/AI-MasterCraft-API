import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { iaServiceFactory } from "../infrastructure/dependecies";
import { AIService } from "../domain/interfaces/IAServices.interface";
import { ApiError } from "../../utilities/apiError";
import { ErrorMessage } from "../../utilities/ErrorMessage";

export class GetIAById {
  async run(req: Request, res: Response): Promise<Response> {
    try {
      const { projectIAId } = req.params;
      const userId = this.extractUserId(req.query.userId);

      this.validateInputs(projectIAId, userId);

      const IAService = await this.createIAService(userId);
      const projectIa = await this.getProjectIA(IAService, projectIAId);

      return res.status(StatusCodes.OK).json(projectIa);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  private extractUserId(userId: unknown): string {
    if (typeof userId !== "string") {
      throw new ApiError(ErrorMessage.ParameterMustBeString, StatusCodes.CONFLICT);
    }
    return userId;
  }

  private validateInputs(projectIAId: string, userId: string): void {
    if (!projectIAId || !userId) {
      throw new ApiError(ErrorMessage.ParametersMustBeDefined, StatusCodes.BAD_REQUEST);
    }
  }

  private async createIAService(userId: string) {
    const IAService = await iaServiceFactory.create(userId);
    if (IAService instanceof Error) {
      throw new ApiError(ErrorMessage.ErrorServiceCreation, StatusCodes.FAILED_DEPENDENCY)
    }
    return IAService;
  }

  private async getProjectIA(IAService: AIService, projectIAId: string) {
    const projectIa = await IAService.getById(projectIAId);
    if (projectIa instanceof Error) {
      throw new ApiError(ErrorMessage.NotFound, StatusCodes.NO_CONTENT)
    }
    return projectIa;
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
