import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      alias: "userId",
    },
    organization: { type: String, required: true, trim: true, alias: "company" },
    position: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    applicationDate: { type: Date },
    applicationUrl: { type: String, trim: true },
    interviewDate: { type: Date },
    interviewDetails: {
      round: { type: String, trim: true },
      mode: { type: String, enum: ["Online", "Onsite", "Phone", "Take-home", "Other"] },
      locationOrLink: { type: String, trim: true },
      interviewerName: { type: String, trim: true },
      feedback: { type: String, trim: true },
    },
    resumeAsset: { type: mongoose.Schema.Types.ObjectId, ref: "FileAsset" },
    resumeGridfsFileId: { type: mongoose.Schema.Types.ObjectId },
    status: {
      type: String,
      enum: ["Saved", "Applied", "Interview", "Offer", "Rejected"],
      default: "Saved",
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

internshipSchema.index({ owner: 1, status: 1, applicationDate: -1 });

export default mongoose.model("InternshipApplication", internshipSchema);
