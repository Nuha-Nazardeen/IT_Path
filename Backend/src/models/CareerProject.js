import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  imageUrl: { type: String, trim: true },
  technologies: [{ type: String, trim: true }],
  startDate: Date,
  status: { type: String, enum: ["Planned", "In Progress", "Completed", "Paused"], default: "In Progress" },
  githubUrl: { type: String, trim: true },
  liveUrl: { type: String, trim: true },
  featuredInPortfolio: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("CareerProject", projectSchema);
