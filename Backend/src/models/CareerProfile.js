import mongoose from "mongoose";

const careerProfileSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      alias: "userId",
    },
    targetJobRole: { type: String, trim: true, default: "" },
    careerGoals: [{ type: String, trim: true }],
    careerSummary: { type: String, trim: true },
    preferredIndustries: [{ type: String, trim: true }],
    preferredLocations: [{ type: String, trim: true }],
    workMode: {
      type: String,
      enum: ["Remote", "Hybrid", "Onsite", "Flexible"],
      default: "Flexible",
    },
    availability: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship"],
      default: "Internship",
    },
    targetGraduationDate: { type: Date },
    weeklyLearningHoursTarget: { type: Number, min: 0, max: 168 },
  },
  { timestamps: true }
);

export default mongoose.model("CareerProfile", careerProfileSchema);
