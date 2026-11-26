import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      alias: "userId",
    },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, default: "General" },
    description: { type: String, trim: true },
    proficiencyLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      default: "Beginner",
    },
    proficiency: { type: Number, min: 0, max: 100, default: 0 },
    status: {
      type: String,
      enum: ["Pending", "Learning", "Practising", "Completed"],
      default: "Pending",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    resources: [{ title: { type: String, trim: true }, url: { type: String, trim: true } }],
  },
  { timestamps: true }
);

skillSchema.index({ owner: 1, name: 1 });
skillSchema.index({ owner: 1, category: 1, status: 1 });

export default mongoose.model("Skill", skillSchema);
