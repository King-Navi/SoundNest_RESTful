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

/**
 * Middleware to validate request body when updating a user's password.
 *
 * Validation schema (`editPasswordUserSchema`):
 * - `code`:        Required, alphanumeric string (2–20 characters).
 * - `newPassword`: Required, trimmed string (1–256 characters).
 * - `email`:       Required, valid email address.
 *
 * If validation fails:
 * - Responds with HTTP 400 and the first Joi error message.
 */

function validateEditUserPassword(req, res, next) {
  const { error } = editPasswordUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

/**
 * Middleware to validate request body for editing user profile data.
 *
 * Validation schema (`editUserSchema`):
 * - `nameUser`:             Optional string (max 100 characters).
 * - `email`:                Optional, valid email address.
 * - `additionalInformation`: Optional string.
 *
 * At least one field must be present (`min(1)` constraint).
 *
 * If validation fails:
 * - Responds with HTTP 400 and the first Joi error message.
 */

function validateEditUser(req, res, next) {
  const { error } = editUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

/**
 * Middleware to validate request body for creating a new user.
 *
 * Validation schema (`newUserSchema`):
 * - `nameUser`:             Optional string (max 100 characters).
 * - `email`:                Optional, valid email address.
 * - `password`:             Optional, trimmed string (1–256 characters).
 * - `code`:                 Optional, alphanumeric string (2–20 characters).
 * - `additionalInformation`: Optional string.
 *
 * If validation fails:
 * - Responds with HTTP 400 and a descriptive validation error message.
 */

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
