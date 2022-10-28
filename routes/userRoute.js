const userRoute = require("express").Router();
const passport = require("passport");
const CustomError = require("../errors");
const { tokenUser, attachCookiesToResponse } = require("../utils/jwt");
const { StatusCodes } = require("http-status-codes");
const Token = require("../models/Token");
const UserController = require("../controller/userController");
const crypto = require("crypto");
const jwtAuth = passport.authenticate("jwt", { session: false });
const upload = require("../utils/multer");
//Signup route
userRoute.post("/signup", function (req, res, next) {
  passport.authenticate("signup", function (err, user, info) {
    if (err) {
      return next(err); // will generate a 500 error
    }
    //If any Error info is generated
    if (info) {
      return res.status(401).send({
        message: info.message,
      });
    }
    res
      .status(StatusCodes.CREATED)
      .json({ message: "User successfully created" });
  })(req, res, next);
});

//Login Route
userRoute.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        return res.status(401).send({
          message: info.message,
        });
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        const userToken = tokenUser(user);
        let refreshToken = "";
        // Check if there is an existing login credential from this user
        const existingToken = await Token.findOne({ user: user._id });
        if (existingToken) {
          const { isValid } = existingToken;
          if (!isValid) {
            return CustomError.UnAuthorizedError(
              "Invalid Request, Please login again"
            );
          }
          //Create a new token for the user if there is an exsting token
          refreshToken = existingToken.refreshToken;
          attachCookiesToResponse({ res, user: userToken, refreshToken });
          res.status(StatusCodes.OK).json({ message: "User is Logged In" });
          return;
        }
        //If there is no existing token, create new token collection
        refreshToken = crypto.randomBytes(40).toString("hex");
        const userAgent = req.headers["user-agent"];
        const ip = req.ip;
        const newUserToken = { refreshToken, ip, userAgent, user: user._id };
        await Token.create(newUserToken);
        attachCookiesToResponse({ res, user: userToken, refreshToken });
        res
          .status(StatusCodes.OK)
          .json({ message: "User successfully Logged In" });
      });
    } catch (error) {
      console.error(err);
    }
  })(req, res, next);
});

//Update Account

userRoute
  .route("/update")
  .patch(jwtAuth, upload.single("image"), UserController.updateProfile);

userRoute.patch("/change-password", jwtAuth, UserController.changePassword);

userRoute.patch("/forgot-password", UserController.forgotPassword);
//Logout Route
userRoute.get("/logout", jwtAuth, async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userID });
  //Change  Access token cookie and expire
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  //Change refresh token cookie and expire
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "User Logged out" });
});

userRoute.delete("/delete-account", jwtAuth, UserController.deleteAccount);

module.exports = userRoute;
