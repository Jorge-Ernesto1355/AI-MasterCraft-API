import { set } from "mongoose";
import { SSEService } from "../../../users/application/services/SSEService";
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
import { inject, injectable } from "tsyringe";
import instance from "tsyringe/dist/typings/dependency-container";

@injectable()
export class MessageService implements messageRepository {
  private contentFormatter: ContentFormatter;

  constructor(
    @inject("SSEService") private readonly sseService: SSEService,

    @inject("messageRepository")
    private readonly messageRepository: messageRepository,

    @inject("IARepository") private readonly IArepository: IARepository
  ) {
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
  async generateIAMessage(projectId: string, prompt: string) {
    try {
      const AIProject = await this.IArepository.getIAById(projectId);
      if (AIProject instanceof Error) throw new Error("Project not found");
      const output = await AIProject.run({
        userId: AIProject.userId,
        prompt: prompt,
      });

      await this.messageRepository.createMessage({
        userId: AIProject.userId,
        AImodelId: AIProject.ModelId,
        output: this.contentFormatter.format({ output: prompt }),
        isIA: false,
        projectId,
      });

      return await this.messageRepository.createMessage({
        userId: AIProject.userId,
        AImodelId: AIProject.ModelId,
        output: this.contentFormatter.format(output),
        isIA: true,
        projectId,
      });
    } catch (error) {
      console.log(error);
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
