const Joi = require("joi");

const playlistUploadSchema = Joi.object({
  playlistName: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500).allow("").optional(),
  imageBase64: Joi.string()
    .pattern(/^data:image\/(png|jpeg|jpg);base64,[A-Za-z0-9+/=]+$/)
    .required(),
});

/**
 * Middleware to validate the playlist creation request body using Joi.
 * - Ensures that `playlistName`, `description` and `imageBase64` are valid.
 * - If validation fails, returns 400 with error details.
 * - If validation succeeds, updates `req.body` with cleaned data.
 */
function validateNewPlaylist(req, res, next) {
  const { error, value } = playlistUploadSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map((d) => d.message),
    });
  }

  req.body = value;
  next();
}

module.exports = validateNewPlaylist;
