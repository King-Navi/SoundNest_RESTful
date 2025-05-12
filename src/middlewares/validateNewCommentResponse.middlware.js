const Joi = require('joi');

const newResponseSchema = Joi.object({
      user: Joi.string()
        .max(100)
        .required()
        .messages({
          'any.required': 'El campo user es obligatorio',
          'string.base': 'El campo user debe ser una cadena de texto',
          'string.max': 'El campo user no puede tener más de 100 caracteres'
        }),
      message: Joi.string()
        .max(500)
        .required()
        .messages({
          'any.required': 'El campo message es obligatorio',
          'string.base': 'El campo message debe ser una cadena de texto',
          'string.max': 'El campo message no puede tener más de 500 caracteres'
        }),
});


function validateResponseSchema(req, res, next) {
    const {error} = newResponseSchema.validate(req.body)
    if (error) {
        return res.status(400).json();
    }
    next();
}

module.exports = {
    validateResponseSchema
};