const { StatusCodes } = require("http-status-codes");
const logger = require("../logger/index");
//Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  //An object of status code and message
  let customError = {
    message: err.message,
    statusCode: err.statusCode,
  };
  //Different cases of errors
  switch (err.name) {
    //MongoDB Validation Error
    case "ValidationError":
      customError.message = `Invalid request; ${Object.values(err.errors)}`;
      customError.statusCode = StatusCodes.BAD_REQUEST;
      break;
    //Error for Duplicate values of unique items
    case "MongoServerError":
      customError.message = `Duplicate value; The title: '${Object.values(
        err.keyValue
      )}' exists already`;
      customError.statusCode = StatusCodes.BAD_REQUEST;
      break;
    //Invalid MongoDB ObjectID
    case "CastError":
      customError.message = `Invalid Mongo ObjectId`;
      customError.statusCode = StatusCodes.BAD_REQUEST;
      break;
    //Other Errors
    default:
      customError.message =
        err.message || "An error occured, please try again later";
      customError.statusCode =
        err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  }
  logger.error(err);
  res
    .status(customError.statusCode)
    .json({ Error: { detail: customError.message, status: "Failed" } });
};
module.exports = errorHandler;
