const User = require("../models/User");
const CustomError = require("../errors");
const { createPassword } = require("./Emails");
const crypto = require("crypto");
const generatePasswordToken = async (user) => {
    //Check if User exist
  const checkUser = await User.findOne({ email: user.email });
  if (!checkUser) {
    throw new CustomError.NotFoundError("User does not exist");
  }
  const fiveMinutes = 5 * 60 * 1000;
  //Check if a token exists and if it does not expire in less than five minutes
  if (
    checkUser.resetPasswordToken &&
    checkUser.resetPasswordExpires > new Date(Date.now() + fiveMinutes)
  ) 
  //Resend mail with the same password token
  {
    await createPassword({
      name: checkUser.name.first,
      email: checkUser.email,
      passwordToken: checkUser.resetPasswordToken,
    });
    // Send mail with a new password token
  } else {
    let resetPasswordToken = crypto.randomBytes(70).toString("hex");
    const fifteenMinutes = 15 * 60 * 1000;
    checkUser.resetPasswordToken = resetPasswordToken;
    checkUser.resetPasswordExpires = new Date(Date.now() + fifteenMinutes);
    await checkUser.save();
    await createPassword({
      name: checkUser.name.first,
      email: checkUser.email,
      passwordToken: resetPasswordToken,
    });
  }
};
module.exports = generatePasswordToken;
