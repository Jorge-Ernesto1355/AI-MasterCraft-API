import { Request, Response } from "express";
import { messageService as MessageService } from "../infrastructure/dependecies";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../utilities/apiError";
import { ErrorMessage } from "../../utilities/ErrorMessage";

export class GenerateIA {
  async run(req: Request, res: Response) {
    try {
      const { prompt, projectId } = this.validate(
        req.query.prompt,
        req.params.projectId,
        req.query.userId
      );

      const messageWithAI = await MessageService.generateIAMessage(
        projectId,
        prompt
      );

      if (messageWithAI instanceof Error) throw new Error(messageWithAI.name);

      return res.status(StatusCodes.OK).json(messageWithAI);
    } catch (error) {
      console.log(error);
      return this.handleError(error, res);
    }
  }

  private validate(prompt: any, projectId: string, userId: any) {
    try {
      if (!prompt || !projectId || !userId)
        throw new ApiError(ErrorMessage.ParametersMustBeDefined);

      if (
        typeof prompt !== "string" ||
        typeof projectId !== "string" ||
        typeof userId !== "string"
      )
        throw new ApiError(ErrorMessage.ParameterMustBeString);

      return { prompt, projectId };
    } catch (error) {
      throw error;
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
