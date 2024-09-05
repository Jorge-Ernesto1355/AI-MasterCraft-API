import { Request, Response } from "express";
import { iaServiceFactory } from "../infrastructure/dependecies";
import { StatusCodes } from "http-status-codes";

export class GenerateIA {
  async run(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      if (!projectId) throw new Error("Arguments must be defined");

      const { prompt, userId } = this.validateString(
        req.query.prompt,
        req.query.userId
      );

      const projectIaService = await iaServiceFactory.create(userId);

      if (projectIaService instanceof Error)
        throw new Error(projectIaService.message);

      const OutPutIA = await projectIaService.generateIAMessage(
        projectId,
        prompt
      );

      return res.status(StatusCodes.OK).json(OutPutIA);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  private validateString(prompt: any, userId: any) {
    try {
      if (!prompt || !userId) throw new Error("Arguments must be defined");

      if (typeof prompt !== "string")
        throw new Error("prompt must be a string");
      if (typeof userId !== "string")
        throw new Error("userId must be a string");

      return { prompt, userId };
    } catch (error) {
      throw error;
    }
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
