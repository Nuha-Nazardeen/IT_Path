import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      alias: "userId",
    },
    name: { type: String, required: true, trim: true, alias: "title" },
    description: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    thumbnailAsset: { type: mongoose.Schema.Types.ObjectId, ref: "FileAsset" },
    thumbnailGridfsFileId: { type: mongoose.Schema.Types.ObjectId },
    technologies: [{ type: String, trim: true }],
    skillIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
    startDate: { type: Date },
    endDate: {
      type: Date,
      validate: {
        validator(value) {
          return !value || !this.startDate || value >= this.startDate;
        },
        message: "endDate must be on or after startDate.",
      },
    },
    status: {
      type: String,
      enum: ["Planned", "In Progress", "Completed", "Paused"],
      default: "In Progress",
    },
    githubUrl: { type: String, trim: true },
    liveUrl: { type: String, trim: true },
    showcaseStatus: {
      type: String,
      enum: ["Draft", "Private", "Showcased"],
      default: "Private",
    },
    featuredInPortfolio: { type: Boolean, default: false },
  },
  { timestamps: true }
);

projectSchema.index({ owner: 1, status: 1 });
projectSchema.index({ owner: 1, showcaseStatus: 1, featuredInPortfolio: 1 });

export default mongoose.model("CareerProject", projectSchema);
