import { Message, MessageDTO } from "../entities/Message";

export interface inputCreateMessage {
  userId: string | null;
  AImodelId: string | null;
  output: any;
  prompt?: string;
  isIA: boolean;
  projectId: string;
}

export interface messageRepository {
  createMessage({}: inputCreateMessage): Promise<Message>;
  getMessages(projectId: string): Promise<MessageDTO[]>;
  generateIAMessage(projectId: string, prompt: string): Promise<MessageDTO>;
}
