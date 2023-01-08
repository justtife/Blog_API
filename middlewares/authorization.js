const CustomError = require("../errors");
const Subscription = require("../models/Subscription");
const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnAuthorizedError(
        "Unauthorized to access this route"
      );
    }
    next();
  };
};
const checkPermission = (requestUser, resourceID) => {
  if (requestUser.role === "admin") return;
  if (requestUser._id.toString() === resourceID.toString()) return;
  throw new CustomError.UnAuthorizedError(
    "You are unauthorised to access this route, ensure you are logged in"
  );
};
const allowAccessToRead = async (article, user) => {
  //Check if article is locked
  if (article.locked === true) {
    if (
      //Check if the user is the article owner
      //Check if the user is an admin
      article.author.toString() === user._id.toString() ||
      user.role === "admin"
    ) {
      return;
    }
    const subscription = await Subscription.findOne({ user: user._id });
    if (subscription.valid === true) {
      return;
    } else {
      throw new CustomError.UnAuthorizedError("Unauthorized");
    }
  } else {
    return;
  }
};
module.exports = { checkRole, checkPermission, allowAccessToRead };
