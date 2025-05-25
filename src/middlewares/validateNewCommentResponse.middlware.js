const Joi = require("joi");

const newResponseSchema = Joi.object({
  message: Joi.string().max(500).required().messages({
    "any.required": "El campo message es obligatorio",
    "string.base": "El campo message debe ser una cadena de texto",
    "string.max": "El campo message no puede tener más de 500 caracteres",
  }),
});

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
