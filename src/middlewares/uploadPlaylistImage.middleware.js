const multer = require("multer");
const fs = require("fs");
const path = require("path");
const tmp = require("tmp");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const uploadDir = process.env.PLAYLIST_IMAGE_PATH_JS;

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const ALLOWED_MIME = {
  "image/jpeg": ".jpg",
  "image/png":  ".png",
  "image/webp": ".webp",
  "image/heic": ".heic",
  "image/heif": ".heif",
};

const fileFilter = (req, file, cb) => {
  const allowed = Object.keys(ALLOWED_MIME);
  if (allowed.includes(file.mimetype)) {
    if (process.env.ENVIROMENT== "development") {
      console.log(file.mimetype);      
    }
    cb(null, true);
  } else {
    cb(new Error("Only .png and .jpg images are allowed"));
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tmpDir = tmp.dirSync({ unsafeCleanup: true });
    req._tmpDirPath = tmpDir.name;
    cb(null, tmpDir.name);
  },
  filename: (req, file, cb) => {
    const ext = ALLOWED_MIME[file.mimetype];
    if (!ext) {
      return cb(new Error("Unsupported file type"));
    }
    const uniqueName = `${uuidv4()}${ext}`;
    req._uploadedFileName = uniqueName;
    cb(null, uniqueName);
  },
});

/**
 * Multer-based middleware to handle temporary image uploads for playlists.
 *
 * Features:
 * - Only accepts image files of the following MIME types:
 *   - image/jpeg (.jpg)
 *   - image/png  (.png)
 *   - image/webp (.webp)
 *   - image/heic (.heic)
 *   - image/heif (.heif)
 *
 * - Files are temporarily stored in a system-generated directory using `tmp.dirSync()`.
 *   - The temporary directory path is attached to `req._tmpDirPath`.
 *   - The generated filename is attached to `req._uploadedFileName`.
 *
 * - Maximum upload size: 20MB.
 * - Destination folder path is loaded from `process.env.PLAYLIST_IMAGE_PATH_JS`.
 *   If it does not exist, it is created recursively at initialization.
 *
 * Notes:
 * - Logs the MIME type to console in development environment if enabled via `process.env.ENVIROMENT`.
 * - Returns 500 or 400 errors via Multer if validation fails (e.g., unsupported MIME type).
 */

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB MAX
});

module.exports = upload;
