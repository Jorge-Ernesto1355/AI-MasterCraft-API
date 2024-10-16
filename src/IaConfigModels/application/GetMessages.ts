import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { ValuesDefaultPagination } from "../../utilities/ValuedDefaultPagination";
import { ApiError } from "../../utilities/apiError";
import { isValidId } from "../../utilities/validateUUID";
import { messageService } from "../infrastructure/dependecies";
import { ErrorMessage } from "../../utilities/ErrorMessage";

interface GetMessagesQuery {
  limit?: string;
  page?: string;
  userId: string;
}

export class GetMessages {
  async run(
    req: Request<{ projectId: string }, {}, {}, GetMessagesQuery>,
    res: Response
  ) {
    try {
      const { projectId } = req.params;
      const { limit, page, userId } = req.query;

      if (!projectId || !userId) {
        throw new ApiError(ErrorMessage.ParametersMustBeDefined);
      }

      const parsedLimit = limit
        ? parseInt(limit, 10)
        : ValuesDefaultPagination.limit;
      const parsedPage = page
        ? parseInt(page, 10)
        : ValuesDefaultPagination.page;

      if (isNaN(parsedLimit) || isNaN(parsedPage)) {
        throw new ApiError(ErrorMessage.InvalidPaginationParameters);
      }

      const messages = await messageService.getMessages({
        projectId,
        userId,
        limit: parsedLimit,
        page: parsedPage,
      });

      return res.status(StatusCodes.OK).json({
        status: "success",
        data: messages,
        pagination: {
          currentPage: parsedPage,
          limit: parsedLimit,
        },
      });
    } catch (error) {
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
}
