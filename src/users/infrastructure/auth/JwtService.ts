import jwt, {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import dotenv from "dotenv";
import {
  tokenPayload,
  tokenService,
  TokenVerificationResult,
} from "./tokenService.inteface";

dotenv.config();

export class JWTService implements tokenService {
  private readonly ACCESS_TOKEN_SECRET: string;
  private readonly REFRESH_TOKEN_SECRET: string;
  private readonly ACCESS_TOKEN_EXPIRES_IN: string;
  private readonly REFRESH_TOKEN_EXPIRES_IN: string;

  constructor() {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error("ACCESS_TOKEN_SECRET is not defined");
    }
    if (!process.env.REFRESH_TOKEN_SECRET) {
      throw new Error("REFRESH_TOKEN_SECRET is not defined");
    }
    if (!process.env.ACCESS_TOKEN_EXPIRES_IN) {
      throw new Error("ACCESS_TOKEN_EXPIRES_IN is not defined");
    }
    if (!process.env.REFRESH_TOKEN_EXPIRES_IN) {
      throw new Error("REFRESH_TOKEN_EXPIRES_IN is not defined");
    }

    this.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    this.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
    this.ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN;
    this.REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN;
  }

  verifyToken(token: string): TokenVerificationResult {
    try {
      const decodedToken = jwt.verify(
        token,
        this.REFRESH_TOKEN_SECRET
      ) as tokenPayload;

      return {
        isValid: true,
        userId: decodedToken.userId,
      };
    } catch (error) {
     
      return this.handleTokenError(error);
    }
  }

  generateAccessToken(userId: string): string {
    const token = jwt.sign({ userId }, this.ACCESS_TOKEN_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
    });

    return token;
  }

  generateRefreshToken(userId: string): string {
    const token = jwt.sign({ userId }, this.REFRESH_TOKEN_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRES_IN,
    });

    return token;
  }

  private handleTokenError(error: unknown): TokenVerificationResult {
    if (error instanceof TokenExpiredError) {
      return {
        isValid: false,
        error: "Token has expired",
      };
    }

    if (error instanceof JsonWebTokenError) {
      return {
        isValid: false,
        error: "Invalid token",
      };
    }

    if (error instanceof NotBeforeError) {
      return {
        isValid: false,
        error: "Token not yet active",
      };
    }

    return {
      isValid: false,
      error: "Unexpected token verification error",
    };
  }
}
