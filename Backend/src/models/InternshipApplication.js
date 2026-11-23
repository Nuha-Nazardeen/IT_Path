import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  organization: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  applicationDate: Date,
  applicationUrl: { type: String, trim: true },
  interviewDate: Date,
  status: { type: String, enum: ["Saved", "Applied", "Interview", "Offer", "Rejected"], default: "Saved" },
  notes: { type: String, trim: true },
}, { timestamps: true });

export default mongoose.model("InternshipApplication", internshipSchema);
