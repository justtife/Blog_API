const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const User = require("../models/User");
module.exports = class UserAPI {
  static async updateProfile(req, res) {
    const { firstname, lastname, email, image, securityQuestion } = req.body;
    if (!firstname || !lastname || !email || !securityQuestion) {
      throw new CustomError.BadRequestError("Invalid Credentials");
    }
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      throw new CustomError.NotFoundError("No Account with user details");
    }
    let profile_image = "";
    if (req.file) {
      if (user.image != "") {
        await cloudinary.uploader.destroy(user.image.split(" ")[0]);
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        use_filename: true,
        folder: "user-images",
      });
      profile_image = result.public_id + " " + result.url;
    }
    user.name.first = firstname;
    user.name.last = lastname;
    user.image = profile_image;
    user.email = email;
    user.securityQuestion = securityQuestion;
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
    const isPasswordValid = user.comparePassword(oldPassword);
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
    res.status(StatusCodes.OK).json({message: "Password updated successfully"})
  }
  static async deleteAccount(req, res) {
    const { securityQuestion } = req.body;
    const user = await User.findById({ _id: req.user.userID });
    const checkSecurityQuestion = user.securityQuestion === securityQuestion;
    if (!checkSecurityQuestion) {
      throw new CustomError.UnAuthorizedError(
        "Invalid answer, please try again"
      );
    }
    await user.remove();
    res
      .status(StatusCodes.NO_CONTENT)
      .json({ message: "User Account successfully deleted" });
  }
};
