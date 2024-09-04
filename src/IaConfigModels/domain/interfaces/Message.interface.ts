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
