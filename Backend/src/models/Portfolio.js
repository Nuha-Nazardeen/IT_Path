import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      alias: "userId",
    },
    profilePhotoUrl: { type: String, trim: true },
    profilePhotoAsset: { type: mongoose.Schema.Types.ObjectId, ref: "FileAsset" },
    profilePhotoGridfsFileId: { type: mongoose.Schema.Types.ObjectId },
    headline: { type: String, trim: true },
    about: { type: String, trim: true },
    university: { type: String, trim: true },
    degree: { type: String, trim: true },
    githubUrl: { type: String, trim: true },
    linkedinUrl: { type: String, trim: true },
    websiteUrl: { type: String, trim: true },
    otherLinks: [{ label: { type: String, trim: true }, url: { type: String, trim: true } }],
    links: [{ label: { type: String, trim: true }, url: { type: String, trim: true } }],
    skills: [{ type: String, trim: true }],
    skillIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
    projectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "CareerProject" }],
    achievementIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Achievement" }],
    isPublic: { type: Boolean, default: false },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      set: (value) => (typeof value === "string" && value.trim() ? value.trim().toLowerCase() : undefined),
    },
  },
  { timestamps: true }
);

portfolioSchema.index({ slug: 1 }, { unique: true, sparse: true });

export default mongoose.model("Portfolio", portfolioSchema);
