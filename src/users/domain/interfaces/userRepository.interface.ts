import { User } from "../entities/User";

export interface userRepository {
  create(
    email: string,
    username: string,
    password: string
  ): Promise<User | Error>;
  getUserById(userId: string): Promise<User | Error>;
  getUserByEmail(email: string): Promise<User | Error>;
  getUserByName(username: string): Promise<User | Error>;
}
