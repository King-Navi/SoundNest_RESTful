const Joi = require("joi");
const fs = require("fs");
const path = require('path');
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
async function validateNewPlaylist(req, res, next)  {
  const result = playlistUploadSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (result.error) {
    try {
      try {
        const fileName = path.parse(req._uploadedFileName).name;
        const extension = path.extname(req._uploadedFileName).replace('.', '');
        await fileManager.deleteImage(fileName, extension);
      } catch (cleanupError) {
        console.warn('[createPlaylist] Failed to clean up file:', cleanupError.message);
      }
    } catch (err) {
      console.error("[validateNewPlaylist] Error deleting file:", err.message);
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
