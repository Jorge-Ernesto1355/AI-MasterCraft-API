import { StatusCodes } from "http-status-codes";

export class ApiError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode = StatusCodes.BAD_REQUEST) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}