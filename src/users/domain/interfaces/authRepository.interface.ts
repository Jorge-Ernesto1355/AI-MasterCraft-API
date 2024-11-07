import { TokenVerificationResult } from "../../infrastructure/auth/tokenService.inteface";

export interface authRepository {
  generateAccessToken(userId: string): Promise<string | Error>;
  generateRefreshToken(userId: string): Promise<string | Error>;
  verifyToken(token: string): TokenVerificationResult;
}
