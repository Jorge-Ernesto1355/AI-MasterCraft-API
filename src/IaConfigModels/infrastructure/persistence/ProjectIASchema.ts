import mongoose, { Document, Schema } from "mongoose";
import { Project } from "../../domain/interfaces/Project.interface";

interface ProjectDocument extends Project, Document {}

const ProjectIaSchema = new Schema({
  projectName: { type: String, maxLength: 30 },
  description: { type: String, maxLength: 100 },
  AImodelId: { ref: "AIModel", type: Schema.Types.ObjectId },
  userId: { ref: "User", type: Schema.Types.ObjectId },
  config: {},
});

const projectIASchema = mongoose.model<ProjectDocument>(
  "ProjectIa",
  ProjectIaSchema
);
export default projectIASchema;
