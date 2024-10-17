import { Request, Response } from "express";
import { iaServiceFactory } from "../infrastructure/dependecies";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../utilities/apiError";
import { ErrorMessage } from "../../utilities/ErrorMessage";

export class GetAvailableIA {
  async run(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { AIType } = req.query;

      if(typeof AIType !== 'string') throw new ApiError(ErrorMessage.InvalidTypeParameters)
      if (!userId) throw new ApiError(ErrorMessage.InvalidTypeParameters);

      const projectIaService = await iaServiceFactory.create(userId);

      if (projectIaService instanceof Error)
        throw new Error(projectIaService.message);

      const availableIAs = await projectIaService.getAvailableIA(AIType);

      return res.status(StatusCodes.OK).json(availableIAs);
    } catch (error) {
      return this.handleError(error, res);
    }
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
