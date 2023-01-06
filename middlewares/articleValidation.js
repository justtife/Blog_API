const CustomError = require("../errors");
const articleValidator = require("../utils/Validator/articleValidation");
const articleValidation = async (req, res, next) => {
  const articlePayload = req.body;
  try {
    await articleValidator.validateAsync(articlePayload);
    next();
  } catch (err) {
    throw new CustomError.BadRequestError(err.details[0].message);
  }
};
module.exports = articleValidation;
