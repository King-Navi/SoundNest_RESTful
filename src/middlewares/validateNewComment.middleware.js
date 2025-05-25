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
