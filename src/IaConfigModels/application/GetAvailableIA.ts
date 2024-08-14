import { Request, Response } from "express";
import { iaServiceFactory } from "../infrastructure/dependecies";
import { StatusCodes } from "http-status-codes";

export class GetAvailableIA {
  async run(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { AIType } = req.query;
      if (typeof AIType !== "string")
        throw new Error("model type must be a string");
      if (!userId) throw new Error("Arguments must be defined");

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
    if (error instanceof Error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
}
