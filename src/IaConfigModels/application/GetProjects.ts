import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { iaServiceFactory } from "../infrastructure/dependecies";

export class GetProjects {
  async run(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;

      if (!userId) throw new Error("Arguments must be defined");

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
      throw new Error(`Failed to create IAService: ${IAService.message}`);
    }
    return IAService;
  }

  private handleError(error: unknown, res: Response): Response {
    if (error instanceof Error) {
      if (error.message === "Project IA not found") {
        return res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
      }
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
}
