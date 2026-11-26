import express from "express";
import multer from "multer";
import requireJwt from "../middleware/auth.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  uploadFileAsset,
  listFileAssets,
  getFileAsset,
  viewFileAsset,
  downloadFileAsset,
  deleteFileAsset,
} from "../controllers/fileController.js";
import { createGridFsMulterStorage, MAX_UPLOAD_BYTES } from "../services/storageService.js";

const router = express.Router();

/**
 * Supports existing JWT middleware when a Bearer token is supplied,
 * while preserving the active cookie-session authentication system.
 */
const requireFileAuth = (req, res, next) => {
  if (req.header("Authorization")) {
    return requireJwt(req, res, next);
  }
  return requireAuth(req, res, next);
};

router.use(requireFileAuth);

const upload = multer({
  storage: createGridFsMulterStorage(),
  limits: {
    fileSize: MAX_UPLOAD_BYTES,
    files: 1,
  },
});

router.get("/", listFileAssets);
router.post("/upload", upload.single("file"), uploadFileAsset);
router.get("/:id", getFileAsset);
router.get("/:id/view", viewFileAsset);
router.get("/:id/download", downloadFileAsset);
router.delete("/:id", deleteFileAsset);

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    return res.status(status).json({ message: error.message });
  }
  return next(error);
});

export default router;
