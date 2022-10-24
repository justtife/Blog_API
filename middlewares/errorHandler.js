const { StatusCodes } = require("http-status-codes");
const errorHandler = (err, req, res, next) => {
  let customError = {
    message: err.message,
    statusCode: err.statusCode,
  };
  console.log(`Caught Error ${err}`);
  console.log(`Caught Error Message ${err.message}`);
  switch (err.message) {
    case "ValidationError":
      customError.message = "Invalid Request";
      customError.statusCode = StatusCodes.BAD_REQUEST;
      break;
    default:
      customError.message = "An error occured, please try again later";
      customError.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
  res.status(customError.statusCode).json({ Error: customError.message });
};
module.exports = errorHandler;
