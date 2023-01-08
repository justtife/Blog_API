const Token = require("../models/Token");
const crypto = require("crypto");
const { tokenUser, attachCookiesToResponse } = require("../utils/jwt");
const _ = require("lodash");
const { StatusCodes } = require("http-status-codes");
const token = async ({ req, res, user }) => {
  const userToken = tokenUser(user);
  let refreshToken;
  let accessToken;
  //Check for existing token
  //Verify the user has been logged in before
  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    //Attach the existing token to cookies if there is an exsting token
    refreshToken = existingToken.refreshToken;
    accessToken = attachCookiesToResponse({
      res,
      user: userToken,
      refreshToken,
    });
    return res.status(StatusCodes.OK).json({
      message: {
        detail: "User logged In Already",
        status: "Success",
        user: _.omit(Object.values(user)[2], [
          "role",
          "enable",
          "password",
          "strategy",
          "resetPasswordToken",
          "resetPasswordExpires",
          "securityQuestion",
          "__v",
        ]),
        token: accessToken,
        expires: 3600,
      },
    });
  }
  //If there is no existing token, create new token collection and attach to cookies
  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const newUserToken = { refreshToken, ip, userAgent, user: user._id };
  await Token.create(newUserToken);
  accessToken = attachCookiesToResponse({
    res,
    user: userToken,
    refreshToken,
  });
  res.status(StatusCodes.OK).json({
    message: {
      detail: "User logged In Successfully",
      status: "Success",
      user: _.omit(Object.values(user)[2], [
        "strategy",
        "resetPasswordToken",
        "resetPasswordExpires",
        "password",
        "securityQuestion",
        "__v",
      ]),
      token: accessToken,
      expires: 3600,
    },
  });
};

module.exports = token;
