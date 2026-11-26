import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      alias: "userId",
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      alias: "moduleId",
    },
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["Lecture", "Reference", "Research", "Document", "Link", "Note"],
      required: true,
    },
    author: { type: String, trim: true },
    url: { type: String, trim: true },
    fileName: { type: String, trim: true },
    fileAsset: { type: mongoose.Schema.Types.ObjectId, ref: "FileAsset" },
    gridfsFileId: { type: mongoose.Schema.Types.ObjectId },
    content: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

resourceSchema.index({ owner: 1, module: 1, type: 1 });
resourceSchema.index({ owner: 1, createdAt: -1 });

export default mongoose.model("AcademicResource", resourceSchema);
