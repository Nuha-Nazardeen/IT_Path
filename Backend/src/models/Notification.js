import mongoose from "mongoose";

export const NOTIFICATION_RELATED_MODELS = [
  "Semester",
  "Module",
  "Assessment",
  "AcademicTask",
  "Skill",
  "CareerProject",
  "InternshipApplication",
  "PlannerTask",
  "WeeklyInsight",
  "Achievement",
];

const notificationSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      alias: "userId",
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, trim: true },
    type: {
      type: String,
      enum: ["Academic", "Career", "Planner", "System"],
      default: "System",
    },
    notificationDate: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
    readAt: { type: Date },
    relatedEntity: {
      kind: { type: String, enum: NOTIFICATION_RELATED_MODELS },
      id: { type: mongoose.Schema.Types.ObjectId, refPath: "relatedEntity.kind" },
    },
  },
  { timestamps: true }
);

notificationSchema.index({ owner: 1, read: 1, notificationDate: -1 });

export default mongoose.model("Notification", notificationSchema);
