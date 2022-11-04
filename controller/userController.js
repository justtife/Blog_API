const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Token = require("../models/Token");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;
const _ = require("lodash");
const { compare } = require("bcrypt");
const refreshTokenOnRequest = require("../utils/refreshToken");
module.exports = class UserAPI {
  //Update Profile Controller
  static async updateProfile(req, res) {
    //Refreshes Token on request if user is logged In
    refreshTokenOnRequest({ req, res });
    const { firstname, lastname, email, securityQuestion } = req.body;
    if (!firstname || !lastname || !email || !securityQuestion) {
      throw new CustomError.BadRequestError(
        `Invalid Credentials, fill all fields`
      );
    }
    const user = await User.findOne({ _id: req.user._id });
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
    user.name.first = firstname;
    user.name.last = lastname;
    user.email = email;
    user.securityQuestion = securityQuestion;
    user.image = image;
    await user.save();
    res.status(StatusCodes.OK).json({
      message: {
        detail: "User account successfully updated",
        status: "Success",
        user: _.omit(Object.values(user)[2], [
          "password",
          "securityQuestion",
          "__v",
        ]),
      },
    });
  }
  //Change Password Controller
  static async changePassword(req, res) {
    //Refreshes Token on request if user is logged In
    refreshTokenOnRequest({ req, res, user: req.user });
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      throw new CustomError.BadRequestError("Invalid Request, fill all fields");
    }
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      throw new CustomError.NotFoundError("No account with user details");
    }
    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      throw new CustomError.UnAuthorizedError(
        "Please ensure the old password is correct"
      );
    }
    user.password = newPassword;
    await user.save();
    res.status(StatusCodes.OK).json({
      message: { detail: "Password changed successfully", status: "Success" },
    });
  }
  //Forgot Password Controller
  static async forgotPassword(req, res) {
    const { securityQuestion, email, password } = req.body;
    if (!securityQuestion || !email || !password) {
      throw new CustomError.BadRequestError("Invalid Request, fill all fields");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError.NotFoundError("Account does not exist");
    }
    const isSecurityQuestion = await compare(
      securityQuestion,
      user.securityQuestion
    );
    if (!isSecurityQuestion) {
      throw new CustomError.UnAuthorizedError(
        "Unauthorized to change password"
      );
    }
    user.password = password;
    await user.save();
    res.status(StatusCodes.OK).json({
      message: { detail: "Password updated successfully", status: "Success" },
    });
  }
  //Delete Controller
  static async deleteAccount(req, res) {
    const { securityQuestion } = req.body;
    if (!securityQuestion) {
      throw new CustomError.BadRequestError("Invalid Request");
    }
    const user = await User.findById({ _id: req.user._id });
    if (!user) {
      throw new CustomError.NotFoundError("Account does not exist");
    }
    if (user.image != "") {
      await cloudinary.uploader.destroy(user.image.split(" ")[0]);
    }
    const isSecurityQuestion = await compare(
      securityQuestion,
      user.securityQuestion
    );
    if (!isSecurityQuestion) {
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
    res.status(StatusCodes.OK).json({
      message: {
        detail: "User Account successfully deleted",
        status: "Success",
      },
    });
  }
};
