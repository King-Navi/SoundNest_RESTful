const Joi = require("joi");

const songUploadSchema = Joi.object({
  imageBase64: Joi.string()
    .pattern(/^data:image\/(png|jpeg|jpg);base64,[A-Za-z0-9+/=]+$/)
    .required(),
});

/**
 * Middleware to validate the `imageBase64` field in the request body using Joi.
 *
 * Validation rules:
 * - `imageBase64` must be a required string.
 * - It must match the pattern for base64-encoded images with MIME types:
 *   - image/png
 *   - image/jpeg
 *   - image/jpg
 * - The pattern must follow the format: `data:image/<type>;base64,<data>`
 *
 * If validation fails:
 * - Responds with HTTP 400 and includes Joi validation error messages.
 *
 * If validation succeeds:
 * - Unknown fields are stripped from the request body.
 * - The validated body is assigned back to `req.body`.
 *
 * Intended for use in routes handling song image uploads via base64 strings.
 */

function validateSongBase64(req, res, next) {
  const { error, value } = songUploadSchema.validate(req.body, {
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

module.exports = validateSongBase64;
