const { StatusCodes } = require("http-status-codes");
const CustomError = require("./custom");

//Inherit from the custom error handler created
class UnAuthorizedError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
module.exports = UnAuthorizedError;
