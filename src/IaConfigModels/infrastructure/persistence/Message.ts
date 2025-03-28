import { model, Schema, Document, PaginateModel } from "mongoose";

import mongoosePaginate from "mongoose-paginate-v2";

export interface IContent {
  type: "text" | "image" | "audio" | "video" | "file" | "code";
  language?: string;
  framework?: string;
  data: string;
  mimeTypee?: "string";
}

export interface Message {
  content: IContent[];
  AImodelId: any;
  isIA: boolean;
  userId: any;
  metadata?: Record<string, any>;
  projectId: any;
}

interface IMessage extends Message, Document {}

const ContentSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ["text", "image", "audio", "video", "file", "code"],
  },
  language: { type: String },
  framework: { type: String },
  data: { type: String, required: true },
  mimeType: { type: String },
});

const MessageSchema = new Schema<IMessage>(
  {
    isIA: { type: Boolean, required: true },
    content: { type: [ContentSchema], required: true },
    AImodelId: { ref: "AIModel", type: Schema.Types.ObjectId },
    projectId: { ref: "AIModel", type: Schema.Types.ObjectId },
    userId: { ref: "User", type: Schema.Types.ObjectId },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

MessageSchema.plugin(mongoosePaginate);

interface MessageModel<T extends Document> extends PaginateModel<T> {}

const Message = model<IMessage, MessageModel<IMessage>>(
  "Message",
  MessageSchema
);

export default Message;
