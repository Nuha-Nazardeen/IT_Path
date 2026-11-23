import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
  title: { type: String, required: true, trim: true },
  type: { type: String, enum: ["Lecture", "Reference", "Research", "Document", "Link", "Note"], required: true },
  url: { type: String, trim: true },
  fileName: { type: String, trim: true },
  content: { type: String, trim: true },
}, { timestamps: true });

export default mongoose.model("AcademicResource", resourceSchema);
