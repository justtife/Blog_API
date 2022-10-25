const { StatusCodes } = require("http-status-codes");
const errorHandler = (err, req, res, next) => {
  let customError = {
    message: err.message,
    statusCode: err.statusCode,
  };
  console.log(`Caught Error ${err}`);
  console.log(`Caught Error Message ${err.message}`);
  console.log(`Name:${err.name}`);
  switch (err.name) {
    case "ValidationError":
      customError.message = `Invalid request; ${Object.values(err.errors)}`;
      customError.statusCode = StatusCodes.BAD_REQUEST;
      break;
    default:
      customError.message =
        err.message || "An error occured, please try again later";
      customError.statusCode =
        err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  }
  res.status(customError.statusCode).json({ Error: customError.message });
};
module.exports = errorHandler;
