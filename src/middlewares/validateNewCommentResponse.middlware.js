const Joi = require("joi");

const newResponseSchema = Joi.object({
  message: Joi.string().max(500).required().messages({
    "any.required": "El campo message es obligatorio",
    "string.base": "El campo message debe ser una cadena de texto",
    "string.max": "El campo message no puede tener más de 500 caracteres",
  }),
});

/**
 * Middleware to validate the request body when submitting a new response.
 *
 * Expected structure:
 * - `message`: Required string field, maximum 500 characters.
 *
 * On validation failure:
 * - Responds with HTTP 400 (Bad Request).
 *
 * On success:
 * - Proceeds to the next middleware or route handler.
 */

function validateResponseSchema(req, res, next) {
  const { error } = newResponseSchema.validate(req.body);
  if (error) {
    return res.status(400).json();
  }
  next();
}

module.exports = {
  validateResponseSchema,
};
