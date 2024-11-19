import { NextFunction, Request, Response } from "express";
import { JWTService } from "../../../users/infrastructure/auth/JwtService";

interface AuthenticatedRequest extends Request {
  user?: {
    userId?: string;
  };
}

class AuthenticationError extends Error {
  constructor(
    message: string,
    public statusCode: number = 401,
    public code: string = "AUTHENTICATION_ERROR"
  ) {
    super(message);
    this.name = "AuthenticationError";
  }
}

const BEARER_PREFIX = "Bearer ";

const extractTokenFromHeader = (authHeader: string | undefined): string => {
  if (!authHeader)
    throw new AuthenticationError("No authorization header provided");

  if (!authHeader.startsWith(BEARER_PREFIX))
    throw new AuthenticationError("Invalid authorization header format");

  const token = authHeader.slice(BEARER_PREFIX.length);
  if (!token) throw new AuthenticationError("No token provided");

  return token;
};

export const accessTokenValidation = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    const jwtService = new JWTService();
    const verificationResult = jwtService.verifyAcessToken(token);

    if (!verificationResult.isValid) {
      throw new AuthenticationError(
        verificationResult.error || "Invalid token",
        401,
        "INVALID_TOKEN"
      );
    }

    req.user = {
      userId: verificationResult.userId,
    };

    return next();
  } catch (error) {
    console.log(error);
    if (error instanceof AuthenticationError) {
      return res.status(error.statusCode).json({
        status: "error",
        code: error.code,
        message: error.message,
      });
    }

    return res.status(500).json({
      status: "error",
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
    });
  }
};
