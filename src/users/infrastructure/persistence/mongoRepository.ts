import { NotFoundUser, NotFoundUserMsg } from "../../domain/ErrorsUser";
import { User } from "../../domain/entities/User";
import { userRepository } from "../../domain/interfaces/userRepository.interface";
import UserModel from "./UserSchema";
import { userMapper } from "../mappers/userMapper";

export class mongoRepository implements userRepository {
  async create(
    email: string,
    username: string,
    password: string
  ): Promise<User | Error> {
    try {
      const newUser = new UserModel({ email, username, password });
      const userSaved = await newUser.save();
      const userToDomain = userMapper.toDomain(userSaved);
      return userToDomain;
    } catch (error) {
      if (error instanceof Error) throw error.message;
      throw new Error("Unexpected Error");
    }
  }
  async getUserByName(username: string): Promise<User | Error> {
    try {
      const userModel = await UserModel.findOne({ username });
      if (!userModel) return new NotFoundUser(NotFoundUserMsg);
      return userMapper.toDomain(userModel);
    } catch (error) {
      throw error;
    }
  }

  async getUserById(userId: string): Promise<User | Error> {
    try {
      const userModel = await UserModel.findById(userId);
      if (!userModel) return new NotFoundUser(NotFoundUserMsg);

      return userMapper.toDomain(userModel);
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | Error> {
    try {
      const userModel = await UserModel.findOne({ email });
      if (!userModel) return new NotFoundUser(NotFoundUserMsg);
      return userMapper.toDomain(userModel);
    } catch (error) {
      throw error;
    }
  }
}
