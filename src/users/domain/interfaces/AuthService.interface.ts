export interface IAuthenticationService {
  generateAccessToken(userId: string): Promise<string | Error>;
  generateRefreshToken(userId: string): Promise<string | Error>;
  verifyToken(token: string): Promise<string | Error>;
}
