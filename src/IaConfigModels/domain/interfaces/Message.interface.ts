export interface IContent {
  type: "text" | "image" | "audio" | "video" | "file" | "code";
  data: string;
  mimeTypee?: string;
  language?: string;
  framework?: string;
}

export interface Message {
  content: IContent[];
  AImodel: any;
  isIA: boolean;
  user: any;
  metadata?: Record<string, any>;
  projectId: any;
}
