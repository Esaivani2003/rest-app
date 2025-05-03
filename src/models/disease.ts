import mongoose, { Schema, model, models } from "mongoose";

const DiseaseSchema = new Schema({
  disease: { type: String, required: true, unique: true },
  avoid: [{ type: String }],
  recommended: [{ type: String }],
  categories: [{ type: String }],
});

const Disease = models.Disease || model("Disease", DiseaseSchema);

export default Disease;
