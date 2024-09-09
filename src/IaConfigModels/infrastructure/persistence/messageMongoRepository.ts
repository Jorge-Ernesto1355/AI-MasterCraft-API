
import { PaginateResult } from "mongoose";
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



export interface PaginatedMessageDTO<T> extends Omit<PaginateResult<T>, 'docs'> {
  docs: T[];
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
 async getMessages({projectId,userId , limit, page}: GetMessagesInput): Promise<PaginatedMessageDTO<MessageDTO>> {

    try {

      const query  = {
        projectId, 
        user:userId
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
      lean: true
    }

    const messages = await Message.paginate(query, options)

    if(Array.isArray(messages.docs)) {
       
      const messagesDomain = messages.docs?.map((message)=> MessageMapper.toDomain(message))
      
      return {
        docs: messagesDomain, 
        ...messages
      }

    }

    

      
    } catch (error) {
      throw error
    }

  }



  generateIAMessage(projectId: string, prompt: string): Promise<MessageDTO> {
    throw new Error("Method not implemented.");
  }
}
 