const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const User = require("../models/User");
const _ = require("lodash");
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
              return done(err, false, {
                message: {
                  detail: `An error Occured; ${err}`,
                  status: "Failed",
                },
              });
            }
            //If there is an existing email,
            //Alert user exists
            if (user) {
              return done(null, false, {
                message: {
                  detail: "User exist already",
                  status: "Failed",
                },
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
                //Send response back
                done(null, newUser, {
                  message: {
                    detail: "User created successfully",
                    status: "Success",
                    user: _.omit(Object.values(newUser)[1], [
                      "password",
                      "securityQuestion",
                      "__v",
                    ]),
                  },
                });
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
          done(null, false);
        }
        try {
          //Find User in the database
          const user = await User.findOne({ email });
          //If no user, throw not found error
          if (!user) {
            return done(null, false, {
              message: {
                detail: "User does not exist, please sign up",
                status: "Failed",
              },
            });
          }
          //Compare password to the hashed password saved in database
          const checkPass = await user.comparePassword(password);
          //Throw error if password is not valid
          if (!checkPass) {
            return done(null, false, {
              message: {
                detail:
                  "Invalid Credentials, please ensure email and password are correct",
                status: "Failed",
              },
            });
          }
          done(null, user);
        } catch (err) {
          done(err, false, {
            message: { detail: `An error occured; ${err}`, status: "Failed" },
          });
        }
      }
    )
  );
  //Cookie Extractor
  var cookieExtractor = function (req) {
    var token = null;
    //Check for signed cookies in response
    if (req && req.signedCookies) {
      token =
        req.signedCookies["accessToken"] || req.signedCookies["refreshToken"];
    }
    return token;
  };
  //JWT Strategy
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        secretOrKey: process.env.JWT_SECRET,
        jwtFromRequest: cookieExtractor,
      },
      async function (jwt_payload, done) {
        //Check if the user saved in token exist in database
        const user = await User.findOne({ _id: jwt_payload.user.userID });
        //If the user does not exist, throw not logged in user
        if (!user) {
          done(null, false, { message: "No logged In User, please login" });
        }
        done(null, user);
      }
    )
  );
};
