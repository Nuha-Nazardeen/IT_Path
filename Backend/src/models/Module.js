import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  semester: { type: mongoose.Schema.Types.ObjectId, ref: "Semester" },
  code: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  credits: { type: Number, default: 0 },
  lecturer: { type: String, trim: true },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  status: { type: String, enum: ["Pending", "Ongoing", "Completed"], default: "Ongoing" },
}, { timestamps: true });

export default mongoose.model("Module", moduleSchema);
