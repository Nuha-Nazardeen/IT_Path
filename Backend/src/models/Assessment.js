import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
  title: { type: String, required: true, trim: true },
  type: { type: String, enum: ["Assignment", "CA", "Presentation", "Viva", "Practical", "Exam", "Project"], required: true },
  dueDate: Date,
  weight: Number,
  score: Number,
  status: { type: String, enum: ["Pending", "Ongoing", "Submitted", "Completed", "Overdue"], default: "Pending" },
  description: { type: String, trim: true },
}, { timestamps: true });

export default mongoose.model("Assessment", assessmentSchema);
