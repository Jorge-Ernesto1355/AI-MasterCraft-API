import { PaginatedMessage } from "../../infrastructure/persistence/messageMongoRepository";
import { Message, MessageDTO } from "../entities/Message";
import {
  GetMessagesInput,
  inputCreateMessage,
  messageRepository as MessageRepository,
} from "../interfaces/messageRepository.interface";

export class messageRepository implements MessageRepository {
  private repository: MessageRepository;

  constructor(repository: MessageRepository) {
    this.repository = repository;
  }
  generateIAMessage(projectId: string, prompt: string): Promise<MessageDTO> {
    return this.repository.generateIAMessage(projectId, prompt);
  }
  createMessage(config: inputCreateMessage): Promise<Message> {
    return this.repository.createMessage(config);
  }
  getMessages({
    projectId,
    userId,
    limit,
    page,
  }: GetMessagesInput): Promise<PaginatedMessage> {
    return this.repository.getMessages({ projectId, userId, limit, page });
  }
}
