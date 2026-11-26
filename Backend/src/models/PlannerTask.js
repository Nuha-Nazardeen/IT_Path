import mongoose from "mongoose";

export const PLANNER_LINKED_MODELS = [
  "Semester",
  "Module",
  "Assessment",
  "AcademicTask",
  "CareerProfile",
  "Skill",
  "CareerProject",
  "InternshipApplication",
];

const taskSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      alias: "userId",
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: {
      type: String,
      enum: ["Academic", "Career", "Personal"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "Ongoing", "Completed", "Cancelled"],
      default: "Pending",
    },
    startDate: { type: Date },
    dueDate: { type: Date },
    completedAt: { type: Date },
    linkedEntity: {
      kind: { type: String, enum: PLANNER_LINKED_MODELS },
      id: { type: mongoose.Schema.Types.ObjectId, refPath: "linkedEntity.kind" },
    },
  },
  { timestamps: true }
);

taskSchema.index({ owner: 1, status: 1, dueDate: 1 });
taskSchema.index({ owner: 1, "linkedEntity.kind": 1, "linkedEntity.id": 1 });

export default mongoose.model("PlannerTask", taskSchema);
