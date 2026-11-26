import mongoose from "mongoose";

export const FILE_ASSET_RELATED_MODELS = [
  "User",
  "Semester",
  "Module",
  "Assessment",
  "AcademicTask",
  "AcademicResource",
  "CareerProject",
  "InternshipApplication",
  "Portfolio",
  "Achievement",
];

export const FILE_FOLDER_TYPES = [
  "profile",
  "lecture-notes",
  "assignments",
  "reference-materials",
  "projects",
  "certificates",
];

const fileAssetSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      alias: "userId",
    },
    gridfsFileId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },
    originalName: { type: String, required: true, trim: true },
    mimeType: { type: String, required: true, trim: true },
    sizeBytes: { type: Number, required: true, min: 0 },
    storageProvider: {
      type: String,
      enum: ["gridfs", "local", "url"],
      default: "gridfs",
    },
    bucket: { type: String, trim: true, default: "itpathFiles" },
    storageKey: { type: String, required: true, trim: true },
    url: { type: String, trim: true },
    checksum: { type: String, trim: true },
    folderType: {
      type: String,
      enum: FILE_FOLDER_TYPES,
    },
    category: {
      type: String,
      enum: ["ProfilePhoto", "Resource", "Submission", "Certificate", "Resume", "ProjectMedia", "Other"],
      default: "Other",
    },
    relatedModel: {
      type: String,
      enum: FILE_ASSET_RELATED_MODELS,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "relatedModel",
    },
  },
  { timestamps: true }
);

fileAssetSchema.index({ owner: 1, createdAt: -1 });
fileAssetSchema.index({ owner: 1, folderType: 1, createdAt: -1 });
fileAssetSchema.index({ owner: 1, relatedModel: 1, relatedId: 1 });

export default mongoose.model("FileAsset", fileAssetSchema);
