import mongoose, { Document, Schema } from "mongoose";

export interface ProjectIa extends Document {
  projectName: string;
  description: string;
  config: any;
  organization: string;
  modelName: string;
  hash: string;
}

const ProjectIaSchema = new Schema({
  projectName: { type: String, maxLength: 30 },
  description: { type: String, maxLength: 100 },
  organization: { type: String },
  modelName: { type: String },
  hash: { type: String },
  config: {},
});

const projectIASchema = mongoose.model<ProjectIa>("ProjectIa", ProjectIaSchema);
export default projectIASchema;
