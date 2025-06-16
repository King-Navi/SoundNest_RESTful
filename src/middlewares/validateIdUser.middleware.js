const Joi = require("joi");

const userIdParamSchema = Joi.object({
  idUser: Joi.number().integer().min(1).required(),
});

/**
 * Middleware to validate the `idUser` route parameter using Joi.
 *
 * Joi Schema (`userIdParamSchema`):
 * - `idUser`: Required, positive integer (≥ 1).
 *
 * Validation options:
 * - `convert: true`: Automatically casts string to number.
 * - `abortEarly: false`: Reports all validation errors.
 * - `allowUnknown: true`: Ignores extra parameters in `req.params`.
 *
 * On failure:
 * - Responds with HTTP 400 and detailed error messages.
 *
 * On success:
 * - `req.params.idUser` is assigned as a validated number.
 */

function validateUserIdParam(req, res, next) {
  const { error, value } = userIdParamSchema.validate(req.params, {
    convert: true,
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      error: "Invalid user ID",
      details: error.details.map((d) => d.message),
    });
  }
  req.params.idUser = value.idUser;
  next();
}

module.exports = {
  validateUserIdParam,
};
