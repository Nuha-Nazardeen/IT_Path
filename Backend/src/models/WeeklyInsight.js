import mongoose from "mongoose";

const insightSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      alias: "userId",
    },
    weekStart: { type: Date, required: true },
    weekEnd: {
      type: Date,
      validate: {
        validator(value) {
          return !value || !this.weekStart || value >= this.weekStart;
        },
        message: "weekEnd must be on or after weekStart.",
      },
    },
    weeklyGoals: [{ type: String, trim: true }],
    observations: { type: String, trim: true },
    accomplishments: { type: String, trim: true },
    challenges: { type: String, trim: true },
    lessons: { type: String, trim: true },
    improvements: { type: String, trim: true },
    nextGoals: { type: String, trim: true },
    academicMinutes: { type: Number, min: 0, default: 0 },
    careerMinutes: { type: Number, min: 0, default: 0 },
    completionPercent: { type: Number, min: 0, max: 100, default: 0 },
  },
  { timestamps: true }
);

insightSchema.index({ owner: 1, weekStart: 1 }, { unique: true });

export default mongoose.model("WeeklyInsight", insightSchema);
