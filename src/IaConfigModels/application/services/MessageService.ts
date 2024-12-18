import { MessageDTO } from "../../domain/entities/Message";
import { IA_NOT_FOUND, IA_NOT_FOUND_MSG } from "../../domain/IAErrors";
import { IARepository } from "../../domain/interfaces/IARepository.interface";
import {
  GetMessagesInput,
  inputCreateMessage,
  messageRepository,
} from "../../domain/interfaces/messageRepository.interface";
import ContentFormatter from "../../domain/utils/ContentFormatter";
import { PaginatedMessage } from "../../infrastructure/persistence/messageMongoRepository";

export class MessageService implements messageRepository {
  private messageRepository: messageRepository;
  private projectRepository: IARepository;
  private contentFormatter: ContentFormatter;

  constructor(
    messageRepository: messageRepository,
    projectRepository: IARepository
  ) {
    this.messageRepository = messageRepository;
    this.projectRepository = projectRepository;
    this.contentFormatter = new ContentFormatter();
  }
  async getMessages({
    projectId,
    userId,
    limit,
    page,
  }: GetMessagesInput): Promise<PaginatedMessage> {
    try {
      const paginatedMessages = await this.messageRepository.getMessages({
        projectId,
        userId,
        limit,
        page,
      });

      return paginatedMessages;
    } catch (error) {
      throw new Error("Something went wrong with message");
    }
  }
  async generateIAMessage(
    projectId: string,
    prompt: string
  ): Promise<MessageDTO> {
    try {
      const projectIA = await this.projectRepository.getIAById(projectId);
      if (projectIA instanceof IA_NOT_FOUND) throw new Error(IA_NOT_FOUND_MSG);
      const outputIA = await projectIA.run(prompt);

      await this.createMessage({
        output: this.contentFormatter.format({ output: prompt }),
        userId: projectIA.userId,
        isIA: false,
        AImodelId: projectIA.ModelId,
        projectId,
      });
      const AIMessage = await this.createMessage({
        output: this.contentFormatter.format(outputIA),
        isIA: true,
        userId: projectIA.userId,
        AImodelId: projectIA.ModelId,
        projectId,
      });
      // creation of user message

      return AIMessage.toJSON();
    } catch (error) {
      console.log(error);
      if (error instanceof Error) throw new Error(error.message);
      throw new Error("Something went wrong with message");
    }
  }

  async createMessage({
    userId,
    AImodelId,
    output,
    isIA,
    projectId,
  }: inputCreateMessage) {
    try {
      return await this.messageRepository.createMessage({
        userId,
        AImodelId,
        output,
        isIA,
        projectId,
      });
    } catch (error) {
      throw error;
    }
  }
}
