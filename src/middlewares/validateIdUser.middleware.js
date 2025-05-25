const Joi = require("joi");

const userIdParamSchema = Joi.object({
  idUser: Joi.number().integer().min(1).required(),
});

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
