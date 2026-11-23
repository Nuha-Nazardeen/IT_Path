import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  category: { type: String, enum: ["Academic", "Career", "Personal"], required: true },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  status: { type: String, enum: ["Pending", "Ongoing", "Completed", "Cancelled"], default: "Pending" },
  dueDate: Date,
  startDate: Date,
  linkedEntity: { kind: String, id: mongoose.Schema.Types.ObjectId },
}, { timestamps: true });

export default mongoose.model("PlannerTask", taskSchema);
