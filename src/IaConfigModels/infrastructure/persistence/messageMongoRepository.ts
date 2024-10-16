import { Types } from "mongoose";
import {
  MessageDTO,
  Message as MessageDomain,
} from "../../domain/entities/Message";
import {
  GetMessagesInput,
  inputCreateMessage,
  messageRepository,
  PaginationInfo,
} from "../../domain/interfaces/messageRepository.interface";
import { MessageMapper } from "../mappers/messageMapper";
import Message from "./Message";
import MessageSchema from "./Message";

export interface PaginatedMessage extends PaginationInfo {
  docs: MessageDomain[];
}

export class messageMongoRepository implements messageRepository {
  async createMessage({
    userId,
    AImodelId,
    output,
    isIA,
    projectId,
  }: inputCreateMessage): Promise<MessageDomain> {
    try {
      const messageData = {
        content: output,
        isIA,
        projectId,
        ...(AImodelId && { AImodelId: new Types.ObjectId(AImodelId) }),
        ...(userId && { userId: new Types.ObjectId(userId) }),
      };

      const newMessage = await MessageSchema.create(messageData);

      const populatedMessage = await Message.findById(newMessage._id)
        .populate("AImodelId")
        .populate("userId")
        .lean()
        .exec();

      if (!populatedMessage)
        throw new Error("Failed to retrieve message with model");

      const objecMessageToDomain = {
        userId: populatedMessage.userId || null,
        AImodelId: populatedMessage.AImodelId, // This will now be the populated AIModel object
        isIA: populatedMessage.isIA,
        id: populatedMessage._id,
        content: populatedMessage.content,
        projectId: populatedMessage.projectId,
      };

      const MessageDomain = MessageMapper.toDomain(objecMessageToDomain);

      return MessageDomain;
    } catch (error) {
      throw error;
    }
  }
  async getMessages({
    projectId,
    userId,
    limit,
    page,
  }: GetMessagesInput): Promise<PaginatedMessage> {
    try {
      const query = {
        projectId,
        userId,
      };

      const options = {
        limit,
        page,
        sort: { created: -1 },
        populate: [
          {
            path: "AImodelId",
            select: ["modelName", "organization", "imageUrl"],
          },
          {
            path: "userId",
            select: ["username", "email"],
          },
        ],
        lean: true,
        collation: { locale: "en" },
      };

      const paginateMessages = await MessageSchema.paginate(query, options);

      if (!paginateMessages || !Array.isArray(paginateMessages.docs)) {
        throw new Error("Paginate is not available");
      }

      const messagesDomain = paginateMessages.docs.map((message) =>
        MessageMapper.toDomain(message)
      );

      return {
        docs: messagesDomain,
        totalDocs: paginateMessages.totalDocs,
        limit: paginateMessages.limit,
        totalPages: paginateMessages.totalPages,
        page: paginateMessages.page ?? 0, // Usar ?? para manejar undefined
        pagingCounter: paginateMessages.pagingCounter ?? 0, // Valor por defecto si undefined
        hasPrevPage: paginateMessages.hasPrevPage ?? false, // Valor por defecto
        hasNextPage: paginateMessages.hasNextPage ?? false, // Valor por defecto
        prevPage: paginateMessages.prevPage ?? null, // Usar ?? para manejar undefined
        nextPage: paginateMessages.nextPage ?? null, // Usar ?? para manejar undefined
      };
    } catch (error) {
      throw error;
    }
  }

  generateIAMessage(projectId: string, prompt: string): Promise<MessageDTO> {
    throw new Error("Method not implemented.");
  }
}
