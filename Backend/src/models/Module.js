import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      alias: "userId",
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
      alias: "semesterId",
    },
    code: { type: String, required: true, trim: true, uppercase: true },
    name: { type: String, required: true, trim: true },
    credits: { type: Number, min: 0, max: 30, default: 0 },
    lecturer: { type: String, trim: true },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    status: {
      type: String,
      enum: ["Pending", "Ongoing", "Completed"],
      default: "Ongoing",
    },
  },
  { timestamps: true }
);

moduleSchema.index({ owner: 1, semester: 1, code: 1 });
moduleSchema.index({ owner: 1, status: 1 });

export default mongoose.model("Module", moduleSchema);
