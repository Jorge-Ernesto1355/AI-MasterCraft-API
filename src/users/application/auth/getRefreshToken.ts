import { Request, Response } from "express";
import { ApiError } from "../../../utilities/apiError";
import { ErrorMessage } from "../../../utilities/ErrorMessage";
import { authService } from "../../infrastructure/auth/dependencies";
import { StatusCodes } from "http-status-codes";

export class getRefreshToken {
  async run(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { refreshToken } = req.body;
      if (!userId || !refreshToken) {
        throw new ApiError(ErrorMessage.ParametersMustBeDefined);
      }

      const tokens = await authService.getRefreshToken({
        userId,
        refreshToken,
      });

      if (tokens instanceof Error)
        throw new ApiError(tokens.message, StatusCodes.UNAUTHORIZED);

      return res.status(200).json(tokens);
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

    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
      code: "InternalServerError",
    });
  }
}
