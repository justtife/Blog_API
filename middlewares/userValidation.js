const CustomError = require("../errors");
const userValidator = require("../utils/Validator/userValidation");
const userValidation = async (req, res, next) => {
  const userPayload = req.body;
  try {
    await userValidator.validateAsync(userPayload);
    next();
  } catch (err) {
    throw new CustomError.BadRequestError(err.details[0].message);
  }
};
module.exports = userValidation;
