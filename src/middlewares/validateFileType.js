const fileType = require("file-type");
const fs = require("fs");
const ALLOWED_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

/**
 * Middleware to validate the actual MIME type of the uploaded file using the `file-type` library.
 * - Ensures that only files with true MIME types of ALLOWED_MIME are accepted.
 * - Prevents spoofing by checking the file's binary signature rather than relying on the extension or mimetype.
 * - If the file type is invalid, the file is deleted from disk and a 400 Bad Request is returned.
 * - If validation passes, the request proceeds to the next middleware.
 */
async function validateFileType(req, res, next) {
  if (!req.file?.path) {
    return res.status(400).json({ error: "File not provided" });
  }

  try {
    const type = await fileType.fileTypeFromFile(req.file.path);

    if (!type || !ALLOWED_MIME.includes(type.mime)) {
      await fs.promises.unlink(req.file.path);
      return res
        .status(400)
        .json({ error: "Invalid file type. Only JPEG, PNG, WebP, HEIC/HEIF are allowed." });
    }

    next();
  } catch (err) {
    console.error("[validateFileType] Error checking file type:", err.message);
    return res.status(500).json({ error: "Internal file validation error" });
  }
}


module.exports = validateFileType;
