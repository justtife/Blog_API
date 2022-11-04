const { StatusCodes } = require("http-status-codes");
const CustomError = require("./custom");

//Inherit from the custom error handler created
class BadRequestError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
module.exports = BadRequestError;
