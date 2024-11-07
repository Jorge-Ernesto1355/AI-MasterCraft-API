export interface tokenService {
  generateAccessToken(userId: string): string;
  generateRefreshToken(userId: string): string;
  verifyToken(token: string): TokenVerificationResult;
}

export interface TokenVerificationResult {
  isValid: boolean;
  userId?: string;
  error?: string;
}

export interface tokenPayload {
  userId: string;
  email?: string;
  iat?: number;
  exp?: number;
}
