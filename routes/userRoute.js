const passport = require("passport");
const userRoute = require("express").Router();
const { StatusCodes } = require("http-status-codes");
const UserController = require("../controller/userController");
//Authentication Middleware
const { Auth } = require("../middlewares/authentication");
const upload = require("../utils/multer");
const userValidation = require("../middlewares/userValidation");
const createToken = require("../utils/token");
const { checkRole } = require("../middlewares/authorization");
//Signup Route
userRoute.post("/signup", userValidation, function (req, res, next) {
  passport.authenticate("signup", function (err, user, info) {
    if (err) {
      return next(err); // will generate an error with status code 500
    }
    //If any Error, info about the Error is generated
    if (info) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: info.message,
      });
    }
  })(req, res, next);
});

//Google SignIn
userRoute.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);
//Callback Route
userRoute.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    //Redirect to validation path
    successRedirect: "/api/v1/validate-user",
    failureRedirect: "/api/v1/signup",
  })
);

//Github Signin
userRoute.get(
  "/auth/github",
  passport.authenticate("github", {
    scope: ["user:email"],
  })
);
//CallBack
userRoute.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    // Redirect to Validation Path
    successRedirect: "/api/v1/validate-user",
    failureRedirect: "/api/v1/signup",
  })
);

//Validate user entry and send back response
userRoute.get("/validate-user", (req, res) => {
  createToken({ req, res, user: req.user });
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
      req.login(user, async (error) => {
        if (error) return next(error);
        //Redirect to validation path
        res.redirect("/api/v1/validate-user");
      });
    } catch (err) {
      console.error(err);
    }
  })(req, res, next);
});

//All Users Profile
userRoute.get(
  "/profile/users",
  checkRole("admin", "owner"),
  UserController.allUsers
);

//All Admins Profile
userRoute.get("/profile/admins", checkRole("owner"), UserController.admin);

//Single User Profile
userRoute
  .route("/profile/:id")
  .get(Auth, UserController.userProfile)
  .patch(Auth, upload.single("user"), UserController.updateProfile);

//Change Password Route
userRoute.patch("/change-password", Auth, UserController.changePassword);

//Forgot Password route
userRoute.post("/forgot-password", UserController.forgotPassword);
//Validate and Create new Password
userRoute.patch("/create-password", UserController.validatePassword);
//Logout Route
userRoute.get("/logout", Auth, UserController.logout);
//Delete Account Route
userRoute.delete("/delete-account", Auth, UserController.deleteAccount);
//Flag and Unflag Account
userRoute.post(
  "/flag",
  [Auth, checkRole("admin", "owner")],
  UserController.flagAccount
);
//Make user an admin
userRoute.post(
  "/make-admin",
  [Auth, checkRole("owner", "admin")],
  UserController.makeAdmin
);
module.exports = userRoute;
