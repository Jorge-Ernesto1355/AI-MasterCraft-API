import { model, Schema, Document, PaginateModel } from "mongoose";

import mongoosePaginate from "mongoose-paginate-v2";

export interface IContent {
  type: "text" | "image" | "audio" | "video" | "file";
  data: string;
  mimeTypee?: "string";
}

export interface Message {
  content: IContent[];
  AImodel: any;
  isIA: boolean;
  user: any;
  metadata?: Record<string, any>;
  projectId: any;
}

interface IMessage extends Message, Document {}

const ContentSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ["text", "image", "audio", "video", "file"],
  },
  data: { type: String, required: true },
  mimeType: { type: String },
});

const MessageSchema = new Schema<IMessage>(
  {
    isIA: { type: Boolean, required: true },
    content: { type: [ContentSchema], required: true },
    AImodel: { ref: "AIModel", type: Schema.Types.ObjectId },
    projectId: { ref: "AIModel", type: Schema.Types.ObjectId },
    user: { ref: "User", type: Schema.Types.ObjectId },
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
