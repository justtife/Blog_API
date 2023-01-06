const { sign } = require("jsonwebtoken");

//Create Token User
const tokenUser = (user) => {
  return { name: user.name.first, userID: user._id };
};

//Create Token
const createJWT = ({ payload }) => {
  const token = sign(payload, process.env.JWT_SECRET, {
    //Token Expires in One Hour
    expiresIn: "1h",
  });
  return token;
};

//Attach Cookies To Response
const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  //Create access tokn
  const accessTokenJWT = createJWT({ payload: { user } });

  //Create refresh token
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });
  //Cookie expiry time
  const fifteenMinutes = 15 * 60 * 1000;
  const oneHour = 60 * 60 * 1000;
  //Access Token
  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    signed: true,
    expires: new Date(Date.now() + fifteenMinutes),
    secure: process.env.NODE_ENV === "production",
  });
  //Refresh Token to refresh accessToken on every request
  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    signed: true,
    expires: new Date(Date.now() + oneHour),
    secure: process.env.NODE_ENV === "production",
  });
  return accessTokenJWT;
};
module.exports = {
  tokenUser,
  createJWT,
  attachCookiesToResponse,
};
