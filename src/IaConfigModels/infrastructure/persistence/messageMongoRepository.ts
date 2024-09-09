
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
import MessageSchema from "./Message";



export interface PaginatedMessageDTO extends PaginationInfo {
  docs: MessageDTO[];
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
 async getMessages({projectId,userId , limit, page}: GetMessagesInput): Promise<PaginatedMessageDTO> {

    try {

      const query  = {
        projectId, 
        user:userId, 
        isDeleted: {$ne: true}
    }

    const options =  {
      limit, 
      page, 
      sort: {created: -1}, 
      populate: [
        {
          path: "AIModel", select: ['modelName'],
        }, 
        {
          path: "user", select: ['username']
        }
      ], 
      lean: true, 
      collation: {locale: "en"},
      select: '_v'
    }

    const paginateMessages = await Message.paginate(query, options)

    if(!paginateMessages || !Array.isArray(paginateMessages.docs)) {
       throw new Error("Paginate is not available")
    }

    const messagesDomain = paginateMessages.docs.map(message => MessageMapper.toDomain(message));

    return {
      docs: messagesDomain,
      totalDocs: paginateMessages.totalDocs,
      limit: paginateMessages.limit,
      totalPages: paginateMessages.totalPages,
      page: paginateMessages.page,
      pagingCounter: paginateMessages.pagingCounter,
      hasPrevPage: paginateMessages.hasPrevPage,
      hasNextPage: paginateMessages.hasNextPage,
      prevPage: paginateMessages.prevPage,
      nextPage: paginateMessages.nextPage
    };
      
    } catch (error) {
      throw error
    }

  }



  generateIAMessage(projectId: string, prompt: string): Promise<MessageDTO> {
    throw new Error("Method not implemented.");
  }
}
 