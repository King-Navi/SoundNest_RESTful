const Joi = require("joi");

const songUploadSchema = Joi.object({
  imageBase64: Joi.string()
    .pattern(/^data:image\/(png|jpeg|jpg);base64,[A-Za-z0-9+/=]+$/)
    .required(),
});

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
