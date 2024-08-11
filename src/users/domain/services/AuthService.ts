import { NotFoundUser } from "../ErrorsUser";
import { userRepository } from "../interfaces/userRepository.interface";
import { User } from "../entities/User";
import { IAuthenticationService } from "../interfaces/AuthService.interface";

interface UserRegister {
  email: string;
  username: string;
  password: string;
}

export class AuthService {
  private readonly userRepository: userRepository;
  private readonly authRepository: IAuthenticationService;

  constructor(
    userRepository: userRepository,
    authRepository: IAuthenticationService
  ) {
    this.userRepository = userRepository;
    this.authRepository = authRepository;
  }

  async register({ email, username, password }: UserRegister) {
    try {
      this.validateEmailAndPassword(email, password);
      await this.verifyExistingUser(email, username);

      const user = await this.userRepository.create(email, username, password);

      if (!(user instanceof User)) throw new Error("user not valid");

      const tokens = await this.authenticate(user.getId());

      if (!(user instanceof User)) throw new Error("Invalid user data");

      return {
        ...user.toJSON(),
        ...tokens,
      };
    } catch (error) {
      return this.handleError(error, "Unexpected Error occurring on register");
    }
  }

  async login({ email, password }: Omit<UserRegister, "username">) {
    try {
      this.validateEmailAndPassword(email, password);

      const userByEmail = await this.userRepository.getUserByEmail(email);
      if (userByEmail instanceof NotFoundUser)
        throw new Error("user not found");

      const isEqualPassword = userByEmail.comparePassword(password);

      if (!isEqualPassword) throw new Error("passwords are not equals");

      const tokens = await this.authenticate(userByEmail.getId());

      return {
        ...userByEmail.toJSON(),
        ...tokens,
      };
    } catch (error) {
      return this.handleError(error, "Unexpected Error occurring on login");
    }
  }

  private async authenticate(
    userId: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.authRepository.generateAccessToken(userId);
    const refreshToken = await this.authRepository.generateRefreshToken(userId);

    if (!(accessToken instanceof Error) && !(refreshToken instanceof Error))
      return { accessToken, refreshToken };

    throw new Error("Error generating tokens");
  }

  private async verifyExistingUser(email: string, username: string) {
    try {
      const userByEmail = await this.userRepository.getUserByEmail(email);
      if (!(userByEmail instanceof NotFoundUser) && userByEmail instanceof User)
        throw new Error("Email already exits");

      const userByUsername = await this.userRepository.getUserByName(username);

      if (
        !(userByUsername instanceof NotFoundUser) &&
        userByUsername instanceof User
      )
        throw new Error("username already exits");
    } catch (error) {
      throw error;
    }
  }

  private validateEmailAndPassword(email: string, password: string) {
    if (!User.isValidEmail(email) || !User.isValidPassword(password))
      throw new Error("Invalid Arguments");
  }

  private handleError(error: unknown, defaultMessage: string) {
    if (error instanceof Error) return new Error(error.message);
    return new Error(defaultMessage);
  }
}
