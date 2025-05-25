const Joi = require("joi");
const NOTIFICATION_RELEVANCE = require("../../modelsMongo/constants/notificationRelevance");

const notificationConsumerSchema = Joi.object({
  title: Joi.string()
    .required()
    .messages({
      "any.required": "Title is required",
      "string.base": "Title must be a string",
    }),

  sender: Joi.string()
    .required()
    .messages({
      "any.required": "Sender is required",
      "string.base": "Sender must be a string",
    }),
  user_id: Joi.number()
    .integer()
    .required()
    .messages({
      "any.required": "User ID is required",
      "number.base": "User ID must be a number",
    }),

  notification: Joi.string()
    .required()
    .messages({
      "any.required": "Notification text is required",
      "string.base": "Notification must be a string",
    }),

  relevance: Joi.string()
    .valid(...Object.values(NOTIFICATION_RELEVANCE))
    .default(NOTIFICATION_RELEVANCE.LOW)
    .messages({
      "any.only": `Relevance must be one of ${Object.values(
        NOTIFICATION_RELEVANCE
      ).join(", ")}`,
    }),
});

function validateNotification(payload) {
  return notificationConsumerSchema.validate(payload, {
    abortEarly: false,
    stripUnknown: true,
  });
}
module.exports = {
  validateNotification,
};
