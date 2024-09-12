import { userRepository as UserRepository } from "../../users/domain/repositories/userRepository";
import { mongoRepository as UserMongoRepository } from "../../users/infrastructure/persistence/mongoRepository";
import { MessageService } from "../application/services/MessageService";
import { IaServiceFactory } from "../domain/IAService";
import { IARepository } from "../domain/repositories/IARepositories";
import { messageRepository as MessageRepository } from "../domain/repositories/messageRepository";
import { IAMongoRepository } from "./persistence/IAMongoRepository";
import { messageMongoRepository as MessageMongoRepository } from "./persistence/messageMongoRepository";

//Persistence
const iaMongoRepository = new IAMongoRepository();
const userMongoRepository = new UserMongoRepository();
const messageMongoRepository = new MessageMongoRepository();

//Repositories
const userRepository = new UserRepository(userMongoRepository);
const iaRepository = new IARepository(iaMongoRepository);
const messageRepository = new MessageRepository(messageMongoRepository);

//Servicies
export const messageService = new MessageService(
  messageRepository,
  iaRepository
);
export const iaServiceFactory = new IaServiceFactory(
  userRepository,
  iaRepository
);
