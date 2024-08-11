import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { iaServiceFactory } from "../infrastructure/dependecies";

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
      throw new Error("userId must be a string");
    }
    return userId;
  }

  private validateInputs(projectIAId: string, userId: string): void {
    if (!projectIAId || !userId) {
      throw new Error("projectIAId and userId must be defined");
    }
  }

  private async createIAService(userId: string) {
    const IAService = await iaServiceFactory.create(userId);
    if (IAService instanceof Error) {
      throw new Error(`Failed to create IAService: ${IAService.message}`);
    }
    return IAService;
  }

  private async getProjectIA(IAService: any, projectIAId: string) {
    const projectIa = await IAService.getIAById(projectIAId);
    if (projectIa instanceof Error) {
      throw new Error("Project IA not found");
    }
    return projectIa;
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
