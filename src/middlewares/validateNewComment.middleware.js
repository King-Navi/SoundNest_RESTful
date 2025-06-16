const Joi = require("joi");

const newCommentSchema = Joi.object({
  song_id: Joi.number().required().messages({
    "any.required": "El campo song_id es obligatorio",
    "number.base": "El campo song_id debe ser un número",
  }),
  message: Joi.string().max(500).required().messages({
    "any.required": "El campo message es obligatorio",
    "string.base": "El campo message debe ser una cadena de texto",
    "string.max": "El campo message no puede tener más de 500 caracteres",
  }),
});

/**
 * Middleware to validate the request body for creating a new comment.
 *
 * Expected request body structure:
 * - `song_id`: A required numeric value identifying the associated song.
 * - `message`: A required text string (maximum 500 characters) representing the comment content.
 *
 * If the validation fails:
 * - Responds with HTTP 400 and the first validation error message.
 *
 * If the validation passes:
 * - Proceeds to the next middleware or route handler.
 */

function validateNewComment(req, res, next) {
  const { error } = newCommentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

module.exports = {
  validateNewComment,
};
