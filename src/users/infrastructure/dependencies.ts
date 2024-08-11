import { userRepository } from "../domain/repositories/userRepository";
import { userServiceFactory } from "../domain/services/userService";
import { mongoRepository } from "./persistence/mongoRepository";

const mongoRepositoryImpl = new mongoRepository();
const userRepositoryImpl = new userRepository(mongoRepositoryImpl);
export const UserServiceFactory = new userServiceFactory(userRepositoryImpl);
