import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema(
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
      required: true,
      alias: "moduleId",
    },
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["Assignment", "CA", "Presentation", "Viva", "Practical", "Exam", "Project"],
      required: true,
    },
    dueDate: { type: Date },
    weight: { type: Number, min: 0, max: 100 },
    maxMarks: { type: Number, min: 0 },
    score: {
      type: Number,
      min: 0,
      validate: {
        validator(value) {
          return value == null || this.maxMarks == null || value <= this.maxMarks;
        },
        message: "score cannot exceed maxMarks.",
      },
    },
    status: {
      type: String,
      enum: ["Pending", "Ongoing", "Submitted", "Completed", "Overdue"],
      default: "Pending",
    },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

assessmentSchema.index({ owner: 1, module: 1, dueDate: 1 });
assessmentSchema.index({ owner: 1, status: 1, dueDate: 1 });

export default mongoose.model("Assessment", assessmentSchema);
