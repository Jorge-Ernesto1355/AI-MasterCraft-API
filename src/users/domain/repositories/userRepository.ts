import { NotFoundUser, NotFoundUserMsg } from "../ErrorsUser";
import { userRepository as IUserRepository } from "../interfaces/userRepository.interface";
import { User } from "../entities/User";
import { inject, injectable } from "tsyringe";
@injectable()
export class userRepository implements IUserRepository {
  constructor(
    @inject("UserMongoRepository") private readonly repository: IUserRepository
  ) {}
  create(
    email: string,
    username: string,
    password: string
  ): Promise<User | Error> {
    try {
      return this.repository.create(email, username, password);
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error("something went wrong to create a user");
    }
  }
  getUserByName(username: string): Promise<User | Error> {
    return this.repository.getUserByName(username);
  }

  getUserById(userId: string): Promise<User | Error> {
    const user = this.repository.getUserById(userId);
    if (user instanceof NotFoundUser) throw new NotFoundUser(NotFoundUserMsg);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | Error> {
    return this.repository.getUserByEmail(email);
  }
}
