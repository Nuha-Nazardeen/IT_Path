import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
  profilePhotoUrl: { type: String, trim: true },
  headline: { type: String, trim: true },
  about: { type: String, trim: true },
  university: { type: String, trim: true },
  degree: { type: String, trim: true },
  skills: [{ type: String, trim: true }],
  links: [{ label: String, url: String }],
}, { timestamps: true });

export default mongoose.model("Portfolio", portfolioSchema);
