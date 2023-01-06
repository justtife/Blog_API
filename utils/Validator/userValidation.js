const Joi = require("joi");

const userValidator = Joi.object({
  firstname: Joi.string().min(3).max(255).required().trim(),
  lastname: Joi.string().min(3).max(255).required().trim(),
  username: Joi.string().alphanum().min(3).max(1255).required().trim(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  securityQuestion: Joi.string().min(3).max(255).required().trim(),
  password: Joi.string()
    .min(6)
    .trim()
    .pattern(new RegExp(/^[a-zA-Z0-9!@#$%&*]{3,25}$/)),
  repeat_password: Joi.ref("password"),
}).with("password", "repeat_password");

module.exports = userValidator;
