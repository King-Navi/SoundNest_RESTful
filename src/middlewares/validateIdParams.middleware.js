const Joi = require('joi');

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
  idAppUser: Joi.number().integer().positive().required()
});

module.exports = {
  validateParams,
  idParamSchema
};
