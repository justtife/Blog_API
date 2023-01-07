const Joi = require("joi");

const articleValidator = Joi.object({
  title: Joi.string().min(3).max(255).required().trim(),
  description: Joi.string().min(3).required().trim(),
  //   tags: Joi.array().items(Joi.string()).required(),
  content: Joi.string().min(5).required().trim().required(),
  state: Joi.string().valid('draft','publish'),
});

module.exports = articleValidator;
