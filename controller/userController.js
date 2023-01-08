const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Token = require("../models/Token");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;
const _ = require("lodash");
const generatePasswordToken = require("../utils/generatePaswordToken");
const refreshTokenOnRequest = require("../utils/refreshToken");
const { checkPermission } = require("../middlewares/authorization");
const {
  passwordChangedMail,
  goodbyeMail,
  flagAccountMail,
  unflagAccountMail,
} = require("../utils/Emails");
module.exports = class UserAPI {
  //User Profile
  static async userProfile(req, res) {
    await refreshTokenOnRequest({ req, res });
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      throw new CustomError.NotFoundError("User does not exist");
    }
    checkPermission(req.user, user._id);
    res.status(StatusCodes.OK).json({
      message: {
        detail: "User Account",
        status: "Success",
        user: _.omit(Object.values(user)[2], [
          "enable",
          "flagged",
          "strategy",
          "resetPasswordToken",
          "resetPasswordExpires",
          "password",
          "position",
          "__v",
        ]),
      },
    });
  }
  //All Users Profile
  static async allUsers(req, res) {
    await refreshTokenOnRequest({ req, res });
    const users = await User.find({ role: "user" }).select(
      "-password -role -resetPasswordToken -resetPasswordExpires -position"
    );
    res
      .status(StatusCodes.OK)
      .json({ message: { detail: "All users", users, status: "Success" } });
  }
  //Get All Admin Profile
  static async admin(req, res) {
    await refreshTokenOnRequest({ req, res });
    const admins = await User.find({ role: "admin" }).select(
      "-password -role -resetPasswordToken -resetPasswordExpires"
    );
    res
      .status(StatusCodes.OK)
      .json({ message: { detail: "All admins", admins, status: "Success" } });
  }
  //Update Profile Controller
  static async updateProfile(req, res) {
    //Refreshes Token on request if user is logged In
    await refreshTokenOnRequest({ req, res });
    const { id: userID } = req.params;
    const { firstname, lastname, username } = req.body;
    if (!firstname || !lastname || !username || userID) {
      throw new CustomError.BadRequestError(
        `Invalid Credentials, fill all fields`
      );
    }
    const user = await User.findOne({ _id: userID });
    if (!user) {
      throw new CustomError.NotFoundError("No Account with user details");
    }
    let image = "";
    if (req.file) {
      if (user.image != "") {
        await cloudinary.uploader.destroy(user.image.split(" ")[0]);
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        use_filename: true,
        folder: "user-images",
      });
      image = result.public_id + " " + result.url;
    }
    if (req.body.profile) {
      user.profile = req.body.profile;
    }
    user.name.first = firstname;
    user.name.last = lastname;
    user.image = image;
    checkPermission(req.user, user._id);
    await user.save();
    res.status(StatusCodes.OK).json({
      message: {
        detail: "User account successfully updated",
        status: "Success",
        user: _.omit(Object.values(user)[2], [
          "role",
          "enable",
          "position",
          "flagged",
          "strategy",
          "resetPasswordToken",
          "resetPasswordExpires",
          "password",
          "__v",
        ]),
      },
    });
  }
  //Change Password Controller
  static async changePassword(req, res) {
    //Refreshes Token on request if user is logged In
    await refreshTokenOnRequest({ req, res });
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      throw new CustomError.BadRequestError("Invalid Request, fill all fields");
    }
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      throw new CustomError.NotFoundError("No account with user details");
    }
    if (!user.password) {
      //Redirect user to create password link
      return res.redirect("http://localhost:5050/api/v1/forgot-password");
    }
    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      throw new CustomError.UnAuthorizedError(
        "Please ensure the old password is correct"
      );
    }
    user.password = newPassword;
    await user.save();
    //Change password mail
    await passwordChangedMail({
      name: req.user.name.first,
      email: req.user.email,
    });
    res.status(StatusCodes.OK).json({
      message: {
        detail: "Password changed successfully",
        inform: "Mail sent",
        status: "Success",
      },
    });
  }
  //Forgot Password Controller
  static async forgotPassword(req, res) {
    const { email } = req.body;
    if (!email) {
      throw new CustomError.BadRequestError("Invalid Request");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError.NotFoundError("User does not exist");
    }
    //Generate password token and send email
    await generatePasswordToken(user);
    res.status(StatusCodes.OK).json({
      message: {
        detail: "An email has been sent to your mail",
        status: "Success",
      },
    });
  }
  //Set new Password
  static async validatePassword(req, res) {
    const { passwordToken } = req.query;
    const { email, password } = req.body;
    if (!passwordToken || !email || !password) {
      throw new CustomError.BadRequestError("Invalid Request");
    }
    const user = await User.findOne({ email });
    if (user) {
      //Check if the password token is the same with the one in the user's collection detail
      if (
        user.resetPasswordToken === passwordToken &&
        user.resetPasswordExpires > new Date(Date.now())
      ) {
        user.password = password;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        if (user.enable == false) {
          user.enable = true;
        }
        await user.save();
        //Valid password mail
        await passwordChangedMail({ name: user.name.first, email: user.email });
        return res.status(StatusCodes.OK).json({
          message: {
            detail: "Password has been changed, proceed to login",
            status: "Success",
          },
        });
      } else {
        throw new CustomError.BadRequestError(
          "Invalid Entry, generate password token again"
        );
      }
    }
    throw new CustomError.NotFoundError("User does not exist");
  }
  static async logout(req, res) {
    //Delete existing user token in database
    await Token.findOneAndDelete({ user: req.user._id });
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
    res
      .status(StatusCodes.OK)
      .json({ message: { detail: "User Logged out", status: "Success" } });
  }
  //Delete Controller
  static async deleteAccount(req, res) {
    const { password } = req.body;
    if (!password) {
      throw new CustomError.BadRequestError(
        "Invalid Request(Password required)"
      );
    }
    const user = await User.findById({ _id: req.user._id });
    if (!user) {
      throw new CustomError.NotFoundError("Account does not exist");
    }
    if (user.image != "") {
      await cloudinary.uploader.destroy(user.image.split(" ")[0]);
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new CustomError.UnAuthorizedError(
        "Unauthorized to perform operation"
      );
    }
    const token = Token.findOne({ user: req.user._id });
    await token.remove();
    res.cookie("accessToken", "account deleted", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.cookie("refreshToken", "account deleted", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    await user.remove();
    //Delete account mail
    //Send mail to the user
    await goodbyeMail({ name: user.name.first, email: user.email });
    res.status(StatusCodes.OK).json({
      message: {
        detail: "User Account successfully deleted",
        status: "Success",
      },
    });
  }
  //Flag Account
  static async flagAccount(req, res) {
    await refreshTokenOnRequest({ req, res });
    const { id, flag } = req.body;
    if (!id) {
      throw new CustomError.BadRequestError("Invalid Request");
    }
    if (flag != true && flag != false) {
      throw new CustomError.BadRequestError("Invalid entry for flag input");
    }
    const user = await User.findById({ _id: id, role: "user" });
    if (!user) {
      throw new CustomError.NotFoundError("User does not exist");
    }
    user.flagged = flag;
    await user.save();
    //Flag account mail
    if (flag == true) {
      flagAccountMail({ name: user.name.first, email: user.email });
    } else {
      unflagAccountMail({ name: user.name.first, email: user.email });
    }
    res.status(StatusCodes.OK).json({
      message: {
        detail: `User Account ${id} successfully updated`,
        flag,
        success: true,
      },
    });
  }
  //Make admin
  static async makeAdmin(req, res) {
    const { user: userID } = req.body;
    const { role } = req.body;
    if (!role) {
      throw new CustomError.BadRequestError("Invalid Request");
    }
    const user = await User.findById({ _id: userID });
    user.role = role;
    await user.save();
    res.status(StatusCodes.OK).json({
      message: { detail: "User is now an admin", status: "success" },
    });
  }
};
