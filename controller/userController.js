const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Token = require("../models/Token");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;
module.exports = class UserAPI {
  static async updateProfile(req, res) {
    const { firstname, lastname, email, securityQuestion } = req.body;
    if (!firstname || !lastname || !email || !securityQuestion) {
      throw new CustomError.BadRequestError("Invalid Credentials");
    }
    console.log(req.user);
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
    res
      .status(StatusCodes.OK)
      .json({ message: "User profile successfully updated" });
  }
  static async changePassword(req, res) {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      throw new CustomError.BadRequestError("Invalid Request");
    }
    const user = await User.findOne({ _id: req.user._id });
    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      throw new CustomError.UnAuthorizedError(
        "Please ensure the old password is correct"
      );
    }
    user.password = newPassword;
    await user.save();
    res
      .status(StatusCodes.OK)
      .json({ message: "Password changed successfully" });
  }
  static async forgotPassword(req, res) {
    const { securityQuestion, email, password } = req.body;
    if (!securityQuestion || !email) {
      throw new CustomError.BadRequestError("Invalid Request");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError.NotFoundError("Account does not exist");
    }
    user.password = password;
    await user.save();
    res
      .status(StatusCodes.OK)
      .json({ message: "Password updated successfully" });
  }
  static async deleteAccount(req, res) {
    const { securityQuestion } = req.body;
    const user = await User.findById({ _id: req.user._id });
    const checkSecurityQuestion = user.securityQuestion === securityQuestion;
    if (!checkSecurityQuestion) {
      throw new CustomError.UnAuthorizedError(
        "Invalid security question, please try again"
      );
    }
    await Token.findByIdAndDelete({ _id: req.user._id });
    await user.remove();
    res
      .status(StatusCodes.OK)
      .json({ message: "User Account successfully deleted" });
  }
};
