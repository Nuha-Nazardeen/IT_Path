import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      alias: "userId",
    },
    name: { type: String, required: true, trim: true },
    organization: { type: String, trim: true },
    date: { type: Date },
    expiryDate: { type: Date },
    category: {
      type: String,
      enum: [
        "Certificate",
        "Online Course",
        "Workshop",
        "Hackathon",
        "Competition",
        "University Award",
        "Research Publication",
        "Other",
      ],
      required: true,
    },
    credentialId: { type: String, trim: true },
    description: { type: String, trim: true },
    previewUrl: { type: String, trim: true },
    fileUrl: { type: String, trim: true },
    certificateAsset: { type: mongoose.Schema.Types.ObjectId, ref: "FileAsset" },
    certificateGridfsFileId: { type: mongoose.Schema.Types.ObjectId },
    verificationUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

achievementSchema.index({ owner: 1, category: 1, date: -1 });

export default mongoose.model("Achievement", achievementSchema);
