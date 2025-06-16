const Joi = require("joi");

const searchQuerySchema = Joi.object({
  songName: Joi.string().min(1).max(100),
  artistName: Joi.string().min(1).max(100),
  idGenre: Joi.number().integer().min(1).positive(),

  limit: Joi.number().integer().min(1).max(60).default(10),
  offset: Joi.number().integer().min(0).default(0),
})
  .or("songName", "artistName", "idGenre")
  .messages({
    "object.missing":
      "Debes enviar al menos uno de estos parámetros en la query: songName, artistName o idGenre.",
    "number.base": "{{#label}} debe ser un número entero.",
    "string.base": "{{#label}} debe ser una cadena de texto.",
    "number.min": "{{#label}} debe ser mayor o igual a {{#limit}}.",
    "number.max": "{{#label}} debe ser menor o igual a {{#limit}}.",
  });

  /**
 * Middleware to validate search query parameters for songs.
 * 
 * Validates that at least one of the following query parameters is present:
 * - songName (string, 1-100 characters)
 * - artistName (string, 1-100 characters)
 * - idGenre (positive integer, minimum 1)
 * 
 * Optional parameters with defaults:
 * - limit (integer between 1 and 60, default 10)
 * - offset (integer >= 0, default 0)
 * 
 * If validation fails, responds with HTTP 400 and a descriptive error message.
 * On success, it sanitizes and assigns the validated query parameters back to req.query.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

function validateSearchQuery(req, res, next) {
  const { error, value } = searchQuerySchema.validate(req.query, {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
    errors: {
      wrap: {
        label: "",
      },
    },
  });

  if (error) {
    const msg = error.details.map((d) => d.message).join(". ");
    return res.status(400).json({ error: msg });
  }

  req.query = value;
  next();
}

module.exports = {
  validateSearchQuery,
  searchQuerySchema,
};
