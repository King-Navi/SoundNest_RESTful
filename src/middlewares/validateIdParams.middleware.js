const Joi = require("joi");

/**
 * Middleware factory to validate route parameters using a Joi schema.
 *
 * @param {Joi.ObjectSchema} schema - Joi schema to validate `req.params`.
 *
 * If validation fails:
 * - Responds with HTTP 400 and the first Joi validation error message.
 *
 * If validation succeeds:
 * - Proceeds to the next middleware/controller.
 *
 * Example usage:
 *   router.get('/user/:idAppUser', validateParams(idParamSchema), handler);
 */

function validateParams(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.params);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
}

const idParamSchema = Joi.object({
  idAppUser: Joi.number().integer().positive().required(),
});

module.exports = {
  validateParams,
  idParamSchema,
};
