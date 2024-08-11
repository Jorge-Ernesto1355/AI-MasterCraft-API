import { userRepository as UserRepository } from "../../users/domain/repositories/userRepository";
import { mongoRepository as UserMongoRepository } from "../../users/infrastructure/persistence/mongoRepository";
import { IaServiceFactory } from "../domain/IAService";
import { IARepository } from "../domain/repositories/IARepositories";
import { IAMongoRepository } from "./persistence/IAMongoRepository";

const iaMongoRepository = new IAMongoRepository();
const userMongoRepository = new UserMongoRepository();
const userRepository = new UserRepository(userMongoRepository);
const iaRepository = new IARepository(iaMongoRepository);
export const iaServiceFactory = new IaServiceFactory(
  userRepository,
  iaRepository
);
