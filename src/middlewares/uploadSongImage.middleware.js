const multer = require("multer");
const fs = require("fs");
const path = require("path");
const tmp = require("tmp");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (allowedMimeTypes.includes(file.mimetype)) {
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
    const ext = path.extname(file.originalname);
    const uniqueName = `${uuidv4()}${ext}`;
    req._uploadedFileName = uniqueName;
    cb(null, uniqueName);
  },
});

/**
 * Multer middleware for handling temporary image uploads.
 *
 * Features:
 * - Accepts only image files with the following MIME types:
 *   - image/jpeg (.jpeg)
 *   - image/png  (.png)
 *   - image/jpg  (.jpg)
 *
 * - Files are temporarily stored in a dynamically generated directory using `tmp.dirSync()`.
 *   - The temporary directory path is stored in `req._tmpDirPath`.
 *   - The generated filename (UUID + original extension) is stored in `req._uploadedFileName`.
 *
 * - Maximum file size: 20MB.
 * - If the uploaded file has an unsupported MIME type, a 400 error is returned by Multer.
 *
 * Intended use:
 * - Pre-processing of images before moving them to permanent storage.
 * - Optional cleanup of temporary files after processing.
 */

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB máximo
});

module.exports = upload;
