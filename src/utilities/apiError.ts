import { StatusCodes } from 'http-status-codes';

export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(name: string, message: string, statusCode: number, isOperational = true) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string): ApiError {
    return new ApiError('BadRequest', message, StatusCodes.BAD_REQUEST);
  }

  static notFound(message: string): ApiError {
    return new ApiError('NotFound', message, StatusCodes.NOT_FOUND);
  }

  static internal(message: string): ApiError {
    return new ApiError('InternalServerError', message, StatusCodes.INTERNAL_SERVER_ERROR, false);
  }
}