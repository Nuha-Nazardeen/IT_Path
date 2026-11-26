import mongoose from "mongoose";

const academicTaskSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      alias: "userId",
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      alias: "moduleId",
    },
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
      alias: "assessmentId",
    },
    title: { type: String, required: true, trim: true },
    taskType: {
      type: String,
      enum: ["Assignment", "Coursework", "Lab", "Reading", "Revision", "Other"],
      default: "Coursework",
    },
    description: { type: String, trim: true },
    dueDate: { type: Date },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Submitted", "Completed", "Overdue"],
      default: "Pending",
    },
    submissionDetails: {
      submittedAt: { type: Date },
      submissionUrl: { type: String, trim: true },
      notes: { type: String, trim: true },
      attachmentAsset: { type: mongoose.Schema.Types.ObjectId, ref: "FileAsset" },
      gridfsFileId: { type: mongoose.Schema.Types.ObjectId },
    },
  },
  { timestamps: true }
);

academicTaskSchema.index({ owner: 1, module: 1, dueDate: 1 });
academicTaskSchema.index({ owner: 1, status: 1, dueDate: 1 });

export default mongoose.model("AcademicTask", academicTaskSchema);
