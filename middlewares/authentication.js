const CustomError = require("../errors");
//Authentication Middleware
const Auth = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.enable === req.user.flagged) {
      throw new CustomError.UnAuthorizedError(
        "Unauthorized to access this route, contact admin for further enquiries"
      );
    } else {
      return next();
    }
  } else {
    throw new CustomError.UnAuthorizedError("Unauthenticated");
  }
};

module.exports = { Auth };
