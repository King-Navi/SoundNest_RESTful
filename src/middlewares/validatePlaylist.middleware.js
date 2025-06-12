const Joi = require("joi");
const fs = require("fs");
const path = require("path");
const fileManager = require("../utils/fileManager")
const playlistUploadSchema = Joi.object({
  playlistName: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500).allow("").optional(),
});
/**
 * Middleware to validate the playlist creation request body using Joi.
 * - Ensures that required fields like `playlistName` are present and valid.
 * - If validation fails, the uploaded file (if any) is deleted from disk to avoid orphaned files.
 * - If validation succeeds, the cleaned `req.body` is passed to the next handler.
 */
async function validateNewPlaylist(req, res, next) {
  const result = playlistUploadSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (result.error) {
     try {
      const parsed = path.parse(req._uploadedFileName || "");
      const fileName = parsed.name;
      const extension = parsed.ext.replace(".", "");
      await fileManager.deleteImage(fileName, extension);
    } catch (cleanupError) {
      console.warn(
        "[validateNewPlaylist] Failed to clean up file:",
        cleanupError.message
      );
    }

    return res.status(400).json({
      message: "Validation error",
      details: result.error.details.map((d) => d.message),
    });
  }
  req.body = result.value;
  next();
}

module.exports = validateNewPlaylist;
