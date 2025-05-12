const Joi = require("joi");
const fs = require('fs');

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
const validateNewPlaylist = () => {
  return async (req, res, next) => {
    const result = playlistUploadSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (result.error) {
      try {
        if (req.file && req.file.path) {
            await fs.promises.unlink(req.file.path);
        }
        } catch (err) {
        console.error('[validateNewPlaylist] Error deleting file:', err.message);
        }

      return res.status(400).json({
        message: "Validation error",
        details: result.error.details.map((d) => d.message),
      });
    }

    req.body = result.value;
    next();
  };
};

module.exports = validateNewPlaylist;
