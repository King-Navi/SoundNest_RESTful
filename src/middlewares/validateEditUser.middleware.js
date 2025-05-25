const Joi = require("joi");

const editPasswordUserSchema = Joi.object({
  code: Joi.string().alphanum().min(2).max(20).required(),
  newPassword: Joi.string().trim().min(1).max(256).required(),
  email: Joi.string().email().required(),
});
const editUserSchema = Joi.object({
  nameUser: Joi.string().max(100).optional(),
  email: Joi.string().email().optional(),
  additionalInformation: Joi.string().optional(),
}).min(1);

const newUserSchema = Joi.object({
  nameUser: Joi.string().max(100),
  email: Joi.string().email(),
  password: Joi.string().trim().min(1).max(256),
  code: Joi.string().alphanum().min(2).max(20),
  additionalInformation: Joi.string().optional(),
});

function validateEditUserPassword(req, res, next) {
  const { error } = editPasswordUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

function validateEditUser(req, res, next) {
  const { error } = editUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}
function validateNewUser(req, res, next) {
  const { error } = newUserSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ error: "Validation error: " + error.details[0].message });
  }
  next();
}

module.exports = {
  validateEditUser,
  validateNewUser,
  validateEditUserPassword,
};
