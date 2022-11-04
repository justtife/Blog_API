const CustomError = require("./custom");
const BadRequestError = require("./badRequest");
const NotFoundError = require("./notFound");
const UnAuthorizedError = require("./unAuthorized");
//Get access to all errors handler from a file
module.exports = {
  CustomError,
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
};
