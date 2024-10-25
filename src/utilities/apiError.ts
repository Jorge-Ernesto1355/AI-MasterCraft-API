import { StatusCodes } from "http-status-codes";

export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true
  ) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string): ApiError {
    return new ApiError(message, StatusCodes.BAD_REQUEST);
  }

  static notFound(message: string): ApiError {
    return new ApiError(message, StatusCodes.NOT_FOUND);
  }

  static internal(message: string): ApiError {
    return new ApiError(message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
