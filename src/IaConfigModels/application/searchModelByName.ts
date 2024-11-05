import { Request, Response } from "express";
import { ErrorMessage } from "../../utilities/ErrorMessage";
import { iaServiceFactory } from "../infrastructure/dependecies";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../utilities/apiError";

export class SearchModelByName {
    async  run(req: Request, response: Response){
        

            try {
                const {userId} = req.params
                const {query} = req.query 
                
                const {userId: validatedUserId, query: validatedQuery} = this.validateInput(userId, query)
                const service = await this.createIAService(validatedUserId)
                const models = await service.searchModelByName(validatedQuery)
                return response.status(StatusCodes.OK).json(models)
            } catch (error) {
              console.log(error)
                this.handleError(error, response)
            }
       

    }

    private validateInput(userId: string, query: any) {
    if(!userId || !query) throw new Error(ErrorMessage.ParameterMustBeString)
    
    if(typeof query !== "string") throw new Error(ErrorMessage.ParameterMustBeString)

    return {userId, query}
    }

    private   async createIAService(userId: string) {
        const IAService = await iaServiceFactory.create(userId);
        if (IAService instanceof Error) {
          throw new ApiError(ErrorMessage.ErrorServiceCreation, StatusCodes.FAILED_DEPENDENCY)
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