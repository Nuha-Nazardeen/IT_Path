import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  status: { type: String, enum: ["Pending", "Learning", "Practising", "Completed"], default: "Pending" },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  proficiency: { type: Number, min: 0, max: 100, default: 0 },
  resources: [{ title: String, url: String }],
}, { timestamps: true });

export default mongoose.model("Skill", skillSchema);
