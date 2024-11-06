import { model, Schema } from "mongoose";

const AImodelSchema = new Schema({
  organization: { type: String },
  modelType: { type: String },
  configuration: { type: Schema.Types.Mixed },
  imageUrl: { type: String },
  modelName: { type: String },
  hash: { type: String },
  
});

const AImodel = model("AIModel", AImodelSchema);

export default AImodel;
