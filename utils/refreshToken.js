const { tokenUser, attachCookiesToResponse } = require("./jwt");
const Token = require("../models/Token");
const { verify } = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
const refreshTokenOnRequest = async ({ req, res }) => {
  //Check if Cookie(Refresh Token) exist on the browser
  if (req.signedCookies["refreshToken"]) {
    var refreshToken = "";
    let payload = verify(
      req.signedCookies["refreshToken"],
      process.env.JWT_SECRET
    );
    let user = await User.findById({ _id: payload.user.userID });
    //Create token user
    const userToken = tokenUser(user);
    //Check for existing token in database
    const existingToken = await Token.findOne({ user: payload.user.userID });
    if (!existingToken) {
      refreshToken = crypto.randomBytes(40).toString("hex");
      const userAgent = req.headers["user-agent"];
      const ip = req.ip;
      const newUserToken = { refreshToken, ip, userAgent, user: user._id };
      await Token.create(newUserToken);
    } else {
      refreshToken = existingToken.refreshToken;
    }
    return attachCookiesToResponse({ res, user: userToken, refreshToken });
  }
};

module.exports = refreshTokenOnRequest;
