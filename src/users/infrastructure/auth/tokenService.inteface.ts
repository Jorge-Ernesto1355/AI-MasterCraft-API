export interface tokenService {
  generateAccessToken(userId: string): string;
  generateRefreshToken(userId: string): string;
  verifyToken(token: string): Promise<string | Error>;
}
