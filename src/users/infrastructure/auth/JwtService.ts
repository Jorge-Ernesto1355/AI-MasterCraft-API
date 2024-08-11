import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { tokenService } from "./tokenService.inteface";

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

  verifyToken(token: string): Promise<string | Error> {
    throw new Error("Method not implemented.");
  }

  generateAccessToken(userId: string): string {
    return jwt.sign({ userId }, this.ACCESS_TOKEN_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
    });
  }

  generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, this.REFRESH_TOKEN_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRES_IN,
    });
  }
}
