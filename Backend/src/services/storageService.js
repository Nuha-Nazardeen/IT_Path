import crypto from "node:crypto";
import path from "node:path";
import { Transform } from "node:stream";
import mongoose from "mongoose";

const MB = 1024 * 1024;
export const BUCKET_NAME = "itpathFiles";
export const MAX_UPLOAD_BYTES = 25 * MB;

export const FILE_FOLDER_CONFIG = {
  profile: {
    folder: "profile",
    fileCategory: "ProfilePhoto",
    maxSizeBytes: 5 * MB,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    allowedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
  },
  "lecture-notes": {
    folder: "academic/lecture-notes",
    fileCategory: "Resource",
    maxSizeBytes: 20 * MB,
    allowedMimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
      "text/markdown",
      "image/jpeg",
      "image/png",
    ],
    allowedExtensions: [".pdf", ".doc", ".docx", ".ppt", ".pptx", ".txt", ".md", ".jpg", ".jpeg", ".png"],
  },
  assignments: {
    folder: "academic/assignments",
    fileCategory: "Submission",
    maxSizeBytes: 20 * MB,
    allowedMimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "application/zip",
      "application/x-zip-compressed",
      "image/jpeg",
      "image/png",
    ],
    allowedExtensions: [".pdf", ".doc", ".docx", ".txt", ".zip", ".jpg", ".jpeg", ".png"],
  },
  "reference-materials": {
    folder: "academic/reference-materials",
    fileCategory: "Resource",
    maxSizeBytes: 25 * MB,
    allowedMimeTypes: [
      "application/pdf",
      "application/epub+zip",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "image/jpeg",
      "image/png",
    ],
    allowedExtensions: [".pdf", ".epub", ".doc", ".docx", ".txt", ".jpg", ".jpeg", ".png"],
  },
  projects: {
    folder: "career/projects",
    fileCategory: "ProjectMedia",
    maxSizeBytes: 10 * MB,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    allowedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".gif"],
  },
  certificates: {
    folder: "achievements/certificates",
    fileCategory: "Certificate",
    maxSizeBytes: 10 * MB,
    allowedMimeTypes: ["application/pdf", "image/jpeg", "image/png", "image/webp"],
    allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png", ".webp"],
  },
};

let cachedDb = null;
let cachedBucket = null;

const createStorageError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export const getGridFsBucket = () => {
  if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
    throw createStorageError(503, "MongoDB connection is not ready for GridFS storage.");
  }
  if (!cachedBucket || cachedDb !== mongoose.connection.db) {
    cachedDb = mongoose.connection.db;
    cachedBucket = new mongoose.mongo.GridFSBucket(cachedDb, {
      bucketName: BUCKET_NAME,
    });
  }
  return cachedBucket;
};

const sanitizeFileName = (originalName) => {
  const baseName = path.basename(String(originalName || "file"));
  const ext = path.extname(baseName).toLowerCase();
  const stem = path
    .basename(baseName, ext)
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);

  return `${stem || "file"}${ext}`;
};

export const hasValidMagicBytes = (buffer, mimeType) => {
  if (!buffer || buffer.length < 4) return false;

  switch (mimeType) {
    case "application/pdf":
      return buffer.subarray(0, 5).toString("ascii") === "%PDF-";
    case "image/png":
      return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
    case "image/jpeg":
      return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    case "image/gif":
      return buffer.subarray(0, 4).toString("ascii") === "GIF8";
    case "image/webp":
      return (
        buffer.length >= 12 &&
        buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
        buffer.subarray(8, 12).toString("ascii") === "WEBP"
      );
    case "application/zip":
    case "application/x-zip-compressed":
    case "application/epub+zip":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return buffer[0] === 0x50 && buffer[1] === 0x4b;
    default:
      return true;
  }
};

export const validateFileRules = ({ folderType, originalName, mimeType, sizeBytes }) => {
  const config = FILE_FOLDER_CONFIG[folderType];
  if (!config) {
    throw createStorageError(
      400,
      `Invalid file category. Allowed categories: ${Object.keys(FILE_FOLDER_CONFIG).join(", ")}.`
    );
  }

  if (sizeBytes !== undefined) {
    if (sizeBytes <= 0) {
      throw createStorageError(400, "Uploaded file is empty.");
    }
    if (sizeBytes > config.maxSizeBytes) {
      const maxMb = Math.round(config.maxSizeBytes / MB);
      throw createStorageError(413, `File exceeds the ${maxMb} MB limit for '${folderType}'.`);
    }
  }

  const normalizedMime = String(mimeType || "").toLowerCase();
  const ext = path.extname(String(originalName || "")).toLowerCase();

  if (!config.allowedMimeTypes.includes(normalizedMime) || !config.allowedExtensions.includes(ext)) {
    throw createStorageError(400, `Unsupported file type (${normalizedMime || ext}) for '${folderType}'.`);
  }

  return config;
};

export const buildUserStorageKey = ({ userId, folderType, originalName }) => {
  const config = FILE_FOLDER_CONFIG[folderType];
  const folder = config ? config.folder : "uploads";
  const safeUserId = String(userId).replace(/[^a-zA-Z0-9_-]/g, "");
  if (!safeUserId) {
    throw createStorageError(400, "Invalid user identifier for storage path.");
  }
  const safeName = sanitizeFileName(originalName);
  return `${safeUserId}/${folder}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
};

export const assertUserOwnsStorageKey = (userId, storageKey) => {
  const expectedPrefix = `${String(userId)}/`;
  if (!storageKey || !storageKey.startsWith(expectedPrefix) || storageKey.includes("..")) {
    throw createStorageError(403, "Access denied for this file path.");
  }
};

export const getAuthUserId = (req) =>
  req.user?.id || req.user?.userId || req.user?._id || req.session?.user?.id;

/**
 * Custom Multer storage engine that streams uploaded chunks directly into
 * MongoDB GridFS (`itpathFiles`) without buffering the full file in memory.
 */
export const createGridFsMulterStorage = () => ({
  _handleFile(req, file, cb) {
    let settled = false;
    const finishOnce = (err, info) => {
      if (settled) return;
      settled = true;
      cb(err, info);
    };

    try {
      const userId = getAuthUserId(req);
      if (!userId) {
        return finishOnce(createStorageError(401, "Authentication required."));
      }

      const rawFolderType = String(
        req.query?.folderType || req.query?.category || req.body?.folderType || req.body?.category || ""
      ).trim();

      let config = null;
      if (rawFolderType) {
        config = validateFileRules({
          folderType: rawFolderType,
          originalName: file.originalname,
          mimeType: file.mimetype,
        });
      }

      const bucket = getGridFsBucket();
      const storageKey = buildUserStorageKey({
        userId,
        folderType: rawFolderType || "profile",
        originalName: file.originalname,
      });

      const metadata = {
        userId: new mongoose.Types.ObjectId(String(userId)),
        owner: new mongoose.Types.ObjectId(String(userId)),
        folderType: rawFolderType || undefined,
        category: config ? config.fileCategory : undefined,
        originalName: path.basename(file.originalname),
        mimeType: file.mimetype,
        storageKey,
      };

      const uploadStream = bucket.openUploadStream(storageKey, {
        metadata,
        contentType: file.mimetype,
      });

      const maxBytes = config ? config.maxSizeBytes : MAX_UPLOAD_BYTES;
      const normalizedMime = String(file.mimetype || "").toLowerCase();
      const hash = crypto.createHash("sha256");
      let totalBytes = 0;
      let headerBuf = Buffer.alloc(0);
      let headerChecked = false;

      const abortUpload = async (err) => {
        if (settled) return;
        settled = true;
        file.stream.unpipe(validatorStream);
        file.stream.resume();
        validatorStream.destroy();
        try {
          if (typeof uploadStream.abort === "function") {
            await uploadStream.abort().catch(() => {});
          } else {
            uploadStream.destroy();
          }
          await bucket.delete(uploadStream.id).catch(() => {});
        } catch {
          // Ignore cleanup errors on aborted stream
        }
        cb(err);
      };

      const validatorStream = new Transform({
        transform(chunk, _encoding, callback) {
          totalBytes += chunk.length;
          if (totalBytes > maxBytes) {
            const maxMb = Math.round(maxBytes / MB);
            return callback(createStorageError(413, `File exceeds the ${maxMb} MB limit.`));
          }

          if (!headerChecked) {
            const needed = 12 - headerBuf.length;
            if (needed > 0) {
              headerBuf = Buffer.concat([headerBuf, chunk.subarray(0, needed)]);
            }
            if (headerBuf.length >= 12) {
              headerChecked = true;
              if (!hasValidMagicBytes(headerBuf, normalizedMime)) {
                return callback(createStorageError(400, "File content does not match the declared file type."));
              }
            }
          }

          hash.update(chunk);
          callback(null, chunk);
        },
        flush(callback) {
          if (totalBytes === 0) {
            return callback(createStorageError(400, "Uploaded file is empty."));
          }
          if (!headerChecked && !hasValidMagicBytes(headerBuf, normalizedMime)) {
            return callback(createStorageError(400, "File content does not match the declared file type."));
          }
          callback();
        },
      });

      file.stream.on("error", (err) => abortUpload(err));
      validatorStream.on("error", (err) => abortUpload(err));
      uploadStream.on("error", (err) => abortUpload(err));

      uploadStream.on("finish", () => {
        finishOnce(null, {
          gridfsFileId: uploadStream.id,
          bucket: BUCKET_NAME,
          storageKey,
          folderType: rawFolderType || undefined,
          fileCategory: config ? config.fileCategory : undefined,
          originalName: path.basename(file.originalname),
          mimeType: file.mimetype,
          size: totalBytes,
          checksum: hash.digest("hex"),
        });
      });

      file.stream.pipe(validatorStream).pipe(uploadStream);
    } catch (error) {
      finishOnce(error);
    }
  },

  _removeFile(_req, file, cb) {
    if (!file?.gridfsFileId) return cb(null);
    try {
      const bucket = getGridFsBucket();
      bucket
        .delete(new mongoose.Types.ObjectId(file.gridfsFileId))
        .then(() => cb(null))
        .catch((err) => cb(err));
    } catch (err) {
      cb(err);
    }
  },
});

export const storageService = {
  bucketName: BUCKET_NAME,
  getGridFsBucket,
  validateFileRules,
  buildUserStorageKey,
  assertUserOwnsStorageKey,

  async findGridFsFile(gridfsFileId) {
    const bucket = getGridFsBucket();
    const files = await bucket.find({ _id: new mongoose.Types.ObjectId(gridfsFileId) }).limit(1).toArray();
    return files[0] || null;
  },

  async updateGridFsMetadata(gridfsFileId, metadataPatch, newFilename) {
    getGridFsBucket();
    const updateDoc = {};
    if (metadataPatch) {
      for (const [key, value] of Object.entries(metadataPatch)) {
        if (value !== undefined) {
          updateDoc[`metadata.${key}`] = value;
        }
      }
    }
    if (newFilename) {
      updateDoc.filename = newFilename;
    }
    if (Object.keys(updateDoc).length === 0) return;

    await mongoose.connection.db
      .collection(`${BUCKET_NAME}.files`)
      .updateOne({ _id: new mongoose.Types.ObjectId(gridfsFileId) }, { $set: updateDoc });
  },

  openDownloadStream(gridfsFileId) {
    const bucket = getGridFsBucket();
    return bucket.openDownloadStream(new mongoose.Types.ObjectId(gridfsFileId));
  },

  async deleteFile(gridfsFileId) {
    if (!gridfsFileId) return;
    const bucket = getGridFsBucket();
    await bucket.delete(new mongoose.Types.ObjectId(gridfsFileId));
  },
};
