import { Message } from "../../domain/entities/Message";

export class MessageMapper {
  static toDomain(entity: any): Message {
    return new Message({
      userId: entity.userId,
      AImodelId: entity.AImodelId,
      isIA: entity.isIA,
      id: entity.id,
      content: entity.content,
      projectId: entity.projectId,
    });
  }
}
