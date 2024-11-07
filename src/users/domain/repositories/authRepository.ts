import {
  tokenService,
  TokenVerificationResult,
} from "../../infrastructure/auth/tokenService.inteface";
import { User } from "../entities/User";
import { NotFoundUser, NotFoundUserMsg } from "../ErrorsUser";
import { authRepository as IAuthRepository } from "../interfaces/authRepository.interface";
import { userRepository } from "../interfaces/userRepository.interface";

export class authRepository implements IAuthRepository {
  private tokenService: tokenService;
  private userRepository: userRepository;

  constructor(tokenService: tokenService, userRepository: userRepository) {
    this.tokenService = tokenService;
    this.userRepository = userRepository;
  }

  async generateAccessToken(userId: string): Promise<string | Error> {
    try {
      const user = await this.userRepository.getUserById(userId);
      if (user instanceof NotFoundUser) throw new Error(NotFoundUserMsg);

      if (user instanceof User)
        return this.tokenService.generateAccessToken(userId);

      throw new Error("Unexpected Error");
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error("Something went wrong with generate accesss token");
    }
  }
  async generateRefreshToken(userId: string): Promise<string | Error> {
    try {
      const user = await this.userRepository.getUserById(userId);
      if (user instanceof NotFoundUser) throw new Error(NotFoundUserMsg);

      if (user instanceof User)
        return this.tokenService.generateRefreshToken(userId);

      throw new Error("Unexpected Error");
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error("Something went wrong with generate accesss token");
    }
  }
  verifyToken(token: string): TokenVerificationResult {
    const decodedToken = this.tokenService.verifyToken(token);
    return decodedToken;
  }
}
