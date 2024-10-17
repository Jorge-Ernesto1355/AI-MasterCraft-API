import { PaginatedMessage } from "../../infrastructure/persistence/messageMongoRepository";
import { Message, MessageDTO } from "../entities/Message";

export interface inputCreateMessage {
  userId: string | null;
  AImodelId: string | null;
  output: any;
  prompt?: string;
  isIA: boolean;
  projectId: string;
}

export interface GetMessagesInput {
  projectId: string;
  userId: string;
  limit: number;
  page: number;
}

export interface PaginationInfo {
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface messageRepository {
  createMessage({ }: inputCreateMessage): Promise<Message>;
  getMessages({
    projectId,
    userId,
    limit,
    page,
  }: GetMessagesInput): Promise<PaginatedMessage>;
  generateIAMessage(projectId: string, prompt: string): Promise<MessageDTO>;
}
