import { Request, Response } from "express";
import { iaServiceFactory } from "../infrastructure/dependecies";
import { StatusCodes } from "http-status-codes";

export class GetAvailableIA {
  async run(req: Request, res: Response) {
    try {
      const { userId: userIdParams } = req.params;
      const { modelType: modelTypeQuery } = req.query;

      const modelType = this.parseModelType(modelTypeQuery);

      const userId = this.validateUserId(userIdParams);

      const projectIaService = await iaServiceFactory.create(userId);

      if (projectIaService instanceof Error)
        throw new Error(projectIaService.message);

      const availableIAs = await projectIaService.getAvailableIA(modelType);

      return res.status(StatusCodes.OK).json(availableIAs);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  private validateUserId(userId: unknown): string {
    if (typeof userId !== "string" || !userId.trim()) {
      throw new Error("Valid user ID must be provided");
    }
    return userId;
  }

  private handleError(error: unknown, res: Response): Response {
    if (error instanceof Error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }

  private parseModelType(modelType: unknown): string | undefined {
    if (modelType === undefined) return undefined;
    if (typeof modelType !== "string") {
      throw new Error("Model type must be a string if provided");
    }
    return modelType;
  }
}
