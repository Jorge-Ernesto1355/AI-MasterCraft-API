import { NotFoundUser } from "../ErrorsUser";
import { userRepository } from "../interfaces/userRepository.interface";

import { User } from "../entities/User";
import { UserService } from "../interfaces/UserService.interface";

export class userService implements UserService {
  private readonly user: User;

  constructor(user: User, userRepository: userRepository) {
    this.user = user;
  }

  getUser() {
    return this.user.toJSON();
  }

  static async create(
    userId: string,
    userRepository: userRepository
  ): Promise<userService> {
    try {
      const user = await userRepository.getUserById(userId);

      if (user instanceof NotFoundUser) throw new Error("Not Found User");

      if (!(user instanceof User))
        throw new Error("Invalid user data returned from repository");

      return new userService(user, userRepository);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error(
        "An unexpected error occurred while creating UserService"
      );
    }
  }
}

export class userServiceFactory {
  constructor(private userRepository: userRepository) {
    this.userRepository = userRepository;
  }

  async createUserService(userId: string): Promise<UserService> {
    return userService.create(userId, this.userRepository);
  }
}
