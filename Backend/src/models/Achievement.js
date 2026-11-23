import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true, trim: true },
  organization: { type: String, trim: true },
  date: Date,
  category: { type: String, enum: ["Certificate", "Online Course", "Workshop", "Hackathon", "Competition", "University Award", "Research Publication", "Other"], required: true },
  previewUrl: { type: String, trim: true },
  fileUrl: { type: String, trim: true },
  verificationUrl: { type: String, trim: true },
}, { timestamps: true });

export default mongoose.model("Achievement", achievementSchema);
