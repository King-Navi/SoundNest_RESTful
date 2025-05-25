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
 * Middleware to validate that req.body.songIds is an array of positive integers.
 * Responds with HTTP 400 if validation fails.
 */
function validateListOfSongsId(req, res, next) {
  const { error } = listOfSongIdsSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

module.exports = { validateListOfSongsId };
