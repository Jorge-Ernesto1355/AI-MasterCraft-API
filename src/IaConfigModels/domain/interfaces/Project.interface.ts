export interface Project {
  _id: string;
  projectName: string;
  description: string;
  organization?: string;
  modelName?: string;
  config?: any;
  IAType?: string;
  userId?: string;
  modelId?: string;
}
