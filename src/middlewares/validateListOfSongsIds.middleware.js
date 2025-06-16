const Joi = require("joi");

const listOfSongIdsSchema = Joi.object({
  songIds: Joi.array()
    .items(
      Joi.number().integer().positive().required().messages({
        "number.base": "Each song ID must be a number",
        "number.integer": "Each song ID must be an integer",
        "number.positive": "Each song ID must be greater than 0",
        "any.required": "Song ID cannot be empty",
      })
    )
    .min(1)
    .required()
    .messages({
      "any.required": "The field songIds is required",
      "array.base": "The field songIds must be an array",
      "array.min": "The list must contain at least one song ID",
    }),
});

/**
 * Middleware to validate the `songIds` field in the request body.
 *
 * Expected Format:
 * - `songIds`: An array of one or more positive integers (≥ 1).
 *
 * Joi Validation Rules:
 * - Each item in the array must be:
 *   - A number
 *   - An integer
 *   - Positive
 * - The array itself must:
 *   - Exist
 *   - Contain at least one element
 *
 * Error Handling:
 * - On validation failure, responds with HTTP 400 and a specific message.
 * - On success, the request proceeds to the next middleware or handler.
 */

function validateListOfSongsId(req, res, next) {
  const { error } = listOfSongIdsSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

module.exports = { validateListOfSongsId };
