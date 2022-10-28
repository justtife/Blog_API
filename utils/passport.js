const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const User = require("../models/User");
const CustomError = require("../errors");
module.exports = function (passport) {
  //Sign up strategy
  passport.use(
    "signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      (req, email, password, done) => {
        process.nextTick(() => {
          User.findOne({ email }, (err, user) => {
            if (err) {
              return done(err, false, { Error: `An error Occured; ${err}` });
            }
            //If there is an existing email,
            //Alert user exists
            if (user) {
              return done(null, false, {
                message: "User with Email Already Exists",
              });
            } else {
              // if there is no user with that email
              // create the user
              var newUser = new User();

              // set the user's local credentials

              newUser.email = email;
              newUser.password = password;
              newUser.name.first = req.body.firstname;
              newUser.name.last = req.body.lastname;
              newUser.securityQuestion = req.body.securityQuestion;
              newUser.save((err) => {
                if (err) {
                  return done(err, false, {
                    Error: `An error occured; ${err}`,
                  });
                }
                done(null, newUser, { message: "User successfully Created" });
              });
            }
          });
        });
      }
    )
  );
  //Login Strategy

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        if (!email || !password) {
          done(null, false, { message: "Invalid credentials" });
        }
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, { message: "Invalid credentials" });
          }
          const checkPass = await user.comparePassword(password);
          if (!checkPass) {
            return done(null, false, { message: "Invalid Credentials" });
          }
          done(null, user, { message: "User successfully logged in" });
        } catch (err) {
          done(err, false, { Error: `An error occured; ${err}` });
        }
      }
    )
  );
  //Cookie Extractor
  var cookieExtractor = function (req) {
    var token = null;
    if (req && req.signedCookies) {
      token =
        req.signedCookies["accessToken"] || req.signedCookies["refreshToken"];
    }
    return token;
  };
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        secretOrKey: process.env.JWT_SECRET,
        jwtFromRequest: cookieExtractor,
      },
      async function (jwt_payload, done) {
        const user = await User.findOne({ _id: jwt_payload.user.userID });
        if (!user) {
          done(null, false, { message: "No logged In User, please login" });
        }
        done(null, user);
      }
    )
  );
};
