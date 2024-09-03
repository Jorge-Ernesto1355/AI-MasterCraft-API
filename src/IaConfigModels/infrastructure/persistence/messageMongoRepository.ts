import UserModel from "../../../users/infrastructure/persistence/UserSchema";
import {
  MessageDTO,
  Message as MessageDomain,
} from "../../domain/entities/Message";
import {
  inputCreateMessage,
  messageRepository,
} from "../../domain/interfaces/messageRepository.interface";
import { MessageMapper } from "../mappers/messageMapper";
import Message from "./Message";

export class messageMongoRepository implements messageRepository {
  async createMessage({
    userId,
    AImodelId,
    output,
    isIA,
    projectId,
  }: inputCreateMessage): Promise<MessageDomain> {
    try {
      const messageData: any = {
        content: output,
        isIA,
        projectId,
      };

      if (!isIA && userId) {
        messageData.userId = userId;
      }

      if (isIA && AImodelId) {
        messageData.AImodelId = AImodelId;
      }

      const newMessage = await Message.create(messageData);
      const messageSaved = await newMessage.save();
      console.log(messageSaved);

      const objecMessageToDomain = {
        userId,
        model: AImodelId,
        isIA,
        id: messageSaved._id,
        content: messageSaved.content,
        projectId,
      };

      const MessageDomain = MessageMapper.toDomain(objecMessageToDomain);
      return MessageDomain;
    } catch (error) {
      throw error;
    }
  }
  getMessages(projectId: string): Promise<MessageDTO[]> {
    throw new Error("Method not implemented.");
  }
  generateIAMessage(projectId: string, prompt: string): Promise<MessageDTO> {
    throw new Error("Method not implemented.");
  }
}
