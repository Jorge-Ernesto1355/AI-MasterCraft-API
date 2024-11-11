import { Request, Response } from "express";
import { ErrorMessage } from "../../utilities/ErrorMessage";
import { iaServiceFactory } from "../infrastructure/dependecies";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../utilities/apiError";

export class SearchModelByName {
  async run(req: Request, response: Response) {
    try {
      
      const { query } = req.query;

      const validatedQuery =
        this.validateInput( query);
      const service = await this.createIAService();
      const models = await service.searchModelByName(validatedQuery);
      return response.status(StatusCodes.OK).json(models);
    } catch (error) {
      return this.handleError(error, response);
    }
  }

  private validateInput(query: any) {
    if ( !query)
      throw new Error(ErrorMessage.ParametersMustBeDefined);

    if (typeof query !== "string")
      throw new Error(ErrorMessage.ParameterMustBeString);

    return query
  }

  private async createIAService(userId?: string) {
    const IAService = await iaServiceFactory.create(userId);
    if (IAService instanceof Error) {
      throw new ApiError(
        ErrorMessage.ErrorServiceCreation,
        StatusCodes.FAILED_DEPENDENCY
      );
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
