import mongoose from "mongoose";

const insightSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  weekStart: { type: Date, required: true },
  accomplishments: { type: String, trim: true },
  challenges: { type: String, trim: true },
  lessons: { type: String, trim: true },
  improvements: { type: String, trim: true },
  nextGoals: { type: String, trim: true },
  academicMinutes: { type: Number, default: 0 },
  careerMinutes: { type: Number, default: 0 },
  completionPercent: { type: Number, min: 0, max: 100, default: 0 },
}, { timestamps: true });

insightSchema.index({ owner: 1, weekStart: 1 }, { unique: true });
export default mongoose.model("WeeklyInsight", insightSchema);
