import { Request, Response } from "express";
import { iaServiceFactory } from "../infrastructure/dependecies";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../utilities/apiError";


export class      GetAvailableIA {  
  async run(req: Request, res: Response) {
    try {
     
      const { type: modelTypeQuery } = req.query;

      const modelType = this.parseModelType(modelTypeQuery);

      const projectIaService = await iaServiceFactory.create();

      if (projectIaService instanceof Error)
        throw new Error(projectIaService.message);

      const availableIAs = await projectIaService.getAvailableIA(modelType);

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

  private parseModelType(modelType: unknown): string | undefined {
    if (modelType === undefined) return undefined;
    if (typeof modelType !== "string") {
      throw new Error("Model type must be a string if provided");
    }
    return modelType;
  }
}
