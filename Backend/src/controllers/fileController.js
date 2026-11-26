import {
  FileAsset,
  User,
  AcademicResource,
  AcademicTask,
  CareerProject,
  Achievement,
  Portfolio,
  InternshipApplication,
} from "../models/index.js";
import { FILE_FOLDER_TYPES } from "../models/FileAsset.js";
import { assertValidObjectId, validateOwnedReferences } from "./studentDataController.js";
import { BUCKET_NAME, getAuthUserId, storageService } from "../services/storageService.js";

const linkFileToRelatedRecord = async ({ owner, relatedModel, relatedId, fileAsset }) => {
  if (!relatedModel || !relatedId) return;

  switch (relatedModel) {
    case "AcademicResource":
      await AcademicResource.findOneAndUpdate(
        { _id: relatedId, owner },
        { fileAsset: fileAsset._id, gridfsFileId: fileAsset.gridfsFileId, fileName: fileAsset.originalName }
      );
      break;
    case "AcademicTask":
      await AcademicTask.findOneAndUpdate(
        { _id: relatedId, owner },
        {
          "submissionDetails.attachmentAsset": fileAsset._id,
          "submissionDetails.gridfsFileId": fileAsset.gridfsFileId,
        }
      );
      break;
    case "CareerProject":
      await CareerProject.findOneAndUpdate(
        { _id: relatedId, owner },
        {
          thumbnailAsset: fileAsset._id,
          thumbnailGridfsFileId: fileAsset.gridfsFileId,
          imageUrl: `/api/files/${fileAsset._id}/view`,
        }
      );
      break;
    case "Achievement":
      await Achievement.findOneAndUpdate(
        { _id: relatedId, owner },
        {
          certificateAsset: fileAsset._id,
          certificateGridfsFileId: fileAsset.gridfsFileId,
          fileUrl: `/api/files/${fileAsset._id}/view`,
        }
      );
      break;
    case "Portfolio":
      await Portfolio.findOneAndUpdate(
        { _id: relatedId, owner },
        {
          profilePhotoAsset: fileAsset._id,
          profilePhotoGridfsFileId: fileAsset.gridfsFileId,
          profilePhotoUrl: `/api/files/${fileAsset._id}/view`,
        }
      );
      break;
    case "InternshipApplication":
      await InternshipApplication.findOneAndUpdate(
        { _id: relatedId, owner },
        { resumeAsset: fileAsset._id, resumeGridfsFileId: fileAsset.gridfsFileId }
      );
      break;
    case "User":
      await User.findByIdAndUpdate(owner, {
        "profile.profilePhotoUrl": `/api/files/${fileAsset._id}/view`,
      });
      break;
    default:
      break;
  }
};

const unlinkFileFromRelatedRecord = async ({ owner, fileAsset }) => {
  const { relatedModel, relatedId, _id: assetId } = fileAsset;
  if (!relatedModel || !relatedId) return;

  switch (relatedModel) {
    case "AcademicResource":
      await AcademicResource.updateOne(
        { _id: relatedId, owner, fileAsset: assetId },
        { $unset: { fileAsset: "", gridfsFileId: "" } }
      );
      break;
    case "AcademicTask":
      await AcademicTask.updateOne(
        { _id: relatedId, owner, "submissionDetails.attachmentAsset": assetId },
        { $unset: { "submissionDetails.attachmentAsset": "", "submissionDetails.gridfsFileId": "" } }
      );
      break;
    case "CareerProject":
      await CareerProject.updateOne(
        { _id: relatedId, owner, thumbnailAsset: assetId },
        { $unset: { thumbnailAsset: "", thumbnailGridfsFileId: "" } }
      );
      break;
    case "Achievement":
      await Achievement.updateOne(
        { _id: relatedId, owner, certificateAsset: assetId },
        { $unset: { certificateAsset: "", certificateGridfsFileId: "" } }
      );
      break;
    case "Portfolio":
      await Portfolio.updateOne(
        { _id: relatedId, owner, profilePhotoAsset: assetId },
        { $unset: { profilePhotoAsset: "", profilePhotoGridfsFileId: "" } }
      );
      break;
    case "InternshipApplication":
      await InternshipApplication.updateOne(
        { _id: relatedId, owner, resumeAsset: assetId },
        { $unset: { resumeAsset: "", resumeGridfsFileId: "" } }
      );
      break;
    default:
      break;
  }
};

const verifyGridFsOwnership = async (owner, fileAsset) => {
  if (fileAsset.storageProvider !== "gridfs" || !fileAsset.gridfsFileId) {
    const err = new Error("Requested file is not stored in GridFS.");
    err.status = 400;
    throw err;
  }

  storageService.assertUserOwnsStorageKey(owner, fileAsset.storageKey);

  const gridFsFile = await storageService.findGridFsFile(fileAsset.gridfsFileId);
  if (!gridFsFile) {
    const err = new Error("File contents not found in GridFS bucket.");
    err.status = 404;
    throw err;
  }

  const metaOwner = gridFsFile.metadata?.userId || gridFsFile.metadata?.owner;
  if (metaOwner && String(metaOwner) !== String(owner)) {
    const err = new Error("Access denied for this file.");
    err.status = 403;
    throw err;
  }

  return gridFsFile;
};

export const uploadFileAsset = async (req, res, next) => {
  const uploadedGridFsId = req.file?.gridfsFileId;

  try {
    const owner = getAuthUserId(req);
    if (!req.file || !uploadedGridFsId) {
      return res.status(400).json({ message: "No file provided for upload." });
    }

    const folderType = String(
      req.body?.folderType || req.body?.category || req.query?.folderType || req.query?.category || ""
    ).trim();

    // Validate folderType, mimeType, extension, and size (covers cases where fields arrived after file)
    const config = storageService.validateFileRules({
      folderType,
      originalName: req.file.originalName,
      mimeType: req.file.mimeType,
      sizeBytes: req.file.size,
    });

    const relatedModel = req.body?.relatedModel ? String(req.body.relatedModel).trim() : undefined;
    const relatedId = req.body?.relatedId ? String(req.body.relatedId).trim() : undefined;

    await validateOwnedReferences("FileAsset", owner, { relatedModel, relatedId });

    let finalStorageKey = req.file.storageKey;
    if (!req.file.folderType) {
      finalStorageKey = storageService.buildUserStorageKey({
        userId: owner,
        folderType,
        originalName: req.file.originalName,
      });
    }

    await storageService.updateGridFsMetadata(
      uploadedGridFsId,
      {
        folderType,
        category: config.fileCategory,
        relatedModel,
        relatedId,
        storageKey: finalStorageKey,
      },
      finalStorageKey
    );

    const record = await FileAsset.create({
      owner,
      gridfsFileId: uploadedGridFsId,
      originalName: req.file.originalName,
      mimeType: req.file.mimeType,
      sizeBytes: req.file.size,
      storageProvider: "gridfs",
      bucket: BUCKET_NAME,
      storageKey: finalStorageKey,
      checksum: req.file.checksum,
      folderType,
      category: config.fileCategory,
      ...(relatedModel && relatedId ? { relatedModel, relatedId } : {}),
    });

    await linkFileToRelatedRecord({ owner, relatedModel, relatedId, fileAsset: record });

    return res.status(201).json(record);
  } catch (error) {
    if (uploadedGridFsId) {
      await storageService.deleteFile(uploadedGridFsId).catch(() => {});
    }
    return next(error);
  }
};

export const listFileAssets = async (req, res, next) => {
  try {
    const query = { owner: getAuthUserId(req) };
    if (req.query.folderType && FILE_FOLDER_TYPES.includes(String(req.query.folderType))) {
      query.folderType = String(req.query.folderType);
    }
    if (typeof req.query.category === "string" && req.query.category.trim()) {
      query.category = req.query.category.trim();
    }
    if (typeof req.query.relatedModel === "string" && req.query.relatedModel.trim()) {
      query.relatedModel = req.query.relatedModel.trim();
    }
    if (typeof req.query.relatedId === "string" && req.query.relatedId.trim()) {
      assertValidObjectId(req.query.relatedId.trim(), "relatedId");
      query.relatedId = req.query.relatedId.trim();
    }

    const records = await FileAsset.find(query).sort({ createdAt: -1 });
    return res.json(records);
  } catch (error) {
    return next(error);
  }
};

export const getFileAsset = async (req, res, next) => {
  try {
    const owner = getAuthUserId(req);
    assertValidObjectId(req.params.id, "FileAsset");

    const record = await FileAsset.findOne({ _id: req.params.id, owner });
    if (!record) {
      return res.status(404).json({ message: "File not found." });
    }

    const gridFsFile =
      record.storageProvider === "gridfs" && record.gridfsFileId
        ? await verifyGridFsOwnership(owner, record)
        : null;

    return res.json({
      ...record.toObject(),
      gridfsMetadata: gridFsFile?.metadata || null,
    });
  } catch (error) {
    return next(error);
  }
};

const streamFileResponse = (disposition) => async (req, res, next) => {
  try {
    const owner = getAuthUserId(req);
    assertValidObjectId(req.params.id, "FileAsset");

    const record = await FileAsset.findOne({ _id: req.params.id, owner });
    if (!record) {
      return res.status(404).json({ message: "File not found." });
    }

    const gridFsFile = await verifyGridFsOwnership(owner, record);
    const safeFilename = String(record.originalName || "file").replace(/["\r\n]/g, "_");

    res.setHeader("Content-Type", record.mimeType || gridFsFile.contentType || "application/octet-stream");
    res.setHeader("Content-Length", String(gridFsFile.length ?? record.sizeBytes));
    res.setHeader("Content-Disposition", `${disposition}; filename="${safeFilename}"`);
    res.setHeader("X-Content-Type-Options", "nosniff");

    const downloadStream = storageService.openDownloadStream(record.gridfsFileId);
    downloadStream.on("error", (err) => {
      if (!res.headersSent) {
        return next(err);
      }
      res.destroy(err);
    });

    return downloadStream.pipe(res);
  } catch (error) {
    return next(error);
  }
};

export const viewFileAsset = streamFileResponse("inline");
export const downloadFileAsset = streamFileResponse("attachment");

export const deleteFileAsset = async (req, res, next) => {
  try {
    const owner = getAuthUserId(req);
    assertValidObjectId(req.params.id, "FileAsset");

    const record = await FileAsset.findOne({ _id: req.params.id, owner });
    if (!record) {
      return res.status(404).json({ message: "File not found." });
    }

    if (record.storageProvider === "gridfs" && record.gridfsFileId) {
      storageService.assertUserOwnsStorageKey(owner, record.storageKey);
      const gridFsFile = await storageService.findGridFsFile(record.gridfsFileId);
      if (gridFsFile) {
        const metaOwner = gridFsFile.metadata?.userId || gridFsFile.metadata?.owner;
        if (metaOwner && String(metaOwner) !== String(owner)) {
          return res.status(403).json({ message: "Access denied for this file." });
        }
        await storageService.deleteFile(record.gridfsFileId);
      }
    }

    await unlinkFileFromRelatedRecord({ owner, fileAsset: record });
    await record.deleteOne();

    return res.json({ message: "File deleted." });
  } catch (error) {
    return next(error);
  }
};
