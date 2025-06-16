const Joi = require("joi");

const editPlaylistSchema = Joi.object({
  playlist_name: Joi.string().max(100),
  description: Joi.string().max(500),
}).or("playlist_name", "description");

/**
 * Middleware to validate request body for editing a playlist using Joi.
 *
 * Validation rules:
 * - `playlist_name`: Optional string, max 100 characters.
 * - `description`:   Optional string, max 500 characters.
 * - At least one of the two fields must be provided (`or` constraint).
 *
 * If validation fails:
 * - Responds with HTTP 400 and an array of Joi validation error messages.
 *
 * If validation succeeds:
 * - Proceeds to the next middleware/controller.
 *
 * Intended for use in PUT/PATCH routes that allow partial playlist updates.
 */

function validateEditPlaylist(req, res, next) {
  const { error } = editPlaylistSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      error: "Invalid input",
      details: error.details.map((detail) => detail.message),
    });
  }

  next();
}

module.exports = {
  validateEditPlaylist,
};
