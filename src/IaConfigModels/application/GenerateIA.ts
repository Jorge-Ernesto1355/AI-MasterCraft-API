import { Request, Response } from "express";
import { messageService as MessageService } from "../infrastructure/dependecies";
import { StatusCodes } from "http-status-codes";

export class GenerateIA {
  async run(req: Request, res: Response) {
    try {
      const { prompt, projectId } = this.validate(
        req.query.prompt,
        req.params.projectId
      );

      const messageWithAI = await MessageService.generateIAMessage(
        projectId,
        prompt
      );

      if (messageWithAI instanceof Error) throw new Error(messageWithAI.name);

      return res.status(StatusCodes.OK).json(messageWithAI);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  private validate(prompt: any, projectId: string) {
    try {
      if (!prompt || !projectId) throw new Error("Arguments must be defined");

      if (typeof prompt !== "string")
        throw new Error("prompt must be a string");
      if (typeof projectId !== "string")
        throw new Error("projectId must be a string");

      return { prompt, projectId };
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
