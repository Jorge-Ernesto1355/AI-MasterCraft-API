import { model, Schema } from "mongoose";

const AImodelSchema = new Schema({
  organization: { type: String },
  IAType: { type: String },
  modelName: { type: String },
  hash: { type: String },
  config: {},
  projectId: { ref: "ProjectIa", type: Schema.Types.ObjectId },
});

const AImodel = model("AIModel", AImodelSchema);

export default AImodel;
