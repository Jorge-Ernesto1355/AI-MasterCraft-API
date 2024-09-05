import { IContent } from "../../infrastructure/persistence/Message";

interface IMessage {
  AImodelId: string;
  userId: string;
  content: IContent[];
  id: string;
  isIA: boolean;
  projectId: string;
}

export interface MessageDTO {
  AImodelId: string;
  userId: string;
  isIA: boolean;
  id: string;
  content: IContent[];
  projectId: string;
}

export class Message {
  private readonly config: IMessage;

  constructor(config: IMessage) {
    this.config = config;
  }

  get user(): string {
    return this.config.userId;
  }

  get model(): string {
    return this.config.AImodelId;
  }

  get isIA(): boolean {
    return this.config.isIA;
  }

  get id(): string {
    return this.config.id;
  }

  get content(): IContent[] {
    return this.config.content;
  }

  public toJSON(): MessageDTO {
    return {
      userId: this.config.userId,
      AImodelId: this.config.AImodelId,
      isIA: this.isIA,
      id: this.id,
      content: this.content,
      projectId: this.config.projectId,
    };
  }
}
