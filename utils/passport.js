const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");
const _ = require("lodash");
const { welcome } = require("../utils/Emails");
const generatePasswordToken = require("../utils/generatePaswordToken");
module.exports = function (passport) {
  //SIGN UP STRATEGY
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
          //Check if email exists
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
              // create new user
              var newUser = new User();

              // set the user's local credentials
              newUser.email = email;
              newUser.password = password;
              newUser.name.user = req.body.username;
              newUser.name.first = req.body.firstname;
              newUser.name.last = req.body.lastname;
              newUser.strategy.push("local");
              newUser.save(async (err) => {
                if (err) {
                  return done(err, false, {
                    Error: `An error occured; ${err}`,
                  });
                }
                //Send Welcome Email
                await welcome({
                  name: req.body.firstname,
                  email: email,
                });
                //Send response back
                done(null, newUser, {
                  message: {
                    detail: "User created successfully",
                    status: "Success",
                    email: "Sent",
                    user: _.omit(Object.values(newUser)[1], [
                      "password",
                      "enable",
                      "flagged",
                      "subscribed",
                      "resetPasswordToken",
                      "resetPasswordExpires",
                      "strategy",
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

  // GOOGLE STRATEGY
  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5050/api/v1/auth/google/callback",
        passReqToCallback: true,
        scope: ["email", "profile"],
      },
      async (request, accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists
          const user = await User.findOne({ email: profile.email });
          if (user) {
            // Check if user has logged in with google before
            if (user.strategy.includes("google")) {
              return done(null, user);
            } else {
              user.strategy.push("google");
            }
            if (user.image === "") {
              user.image = profile.picture;
            }
            await user.save();
            return done(null, user);
          } else {
            // if there is no user with that email
            // create new user
            var newUser = new User();

            // set the user's local credentials
            newUser.email = profile.email;
            newUser.name.user = profile.displayName;
            newUser.name.first = profile.given_name;
            newUser.name.last = profile.family_name;
            newUser.image = profile.picture;
            newUser.strategy.push("google");
            newUser.enable = false;
            newUser.save(async (err) => {
              if (err) {
                return done(err, false, {
                  Error: `An error occured; ${err}`,
                });
              }
              //Send Welcome Email
              await welcome({
                name: profile.given_name,
                email: profile.email,
              });
              //Send link to create Password
              generatePasswordToken(newUser);
              //Send response back
              done(null, newUser);
            });
          }
        } catch (err) {
          done(err, false, {
            message: { detail: `An error occured; ${err}` },
          });
        }
      }
    )
  );

  //GITHUB STRATEGY
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:5050/api/v1/auth/github/callback",
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists
          const user = await User.findOne({ email: profile.emails[0].value });
          if (user) {
            // Check if user has logged in with google before
            if (user.strategy.includes("github")) {
              return done(null, user);
            } else {
              user.strategy.push("github");
            }
            if (user.image === "") {
              user.image = profile.photos[0].value;
            }
            await user.save();
            return done(null, user);
          } else {
            // if there is no user with that email
            // create new user
            var newUser = new User();

            // set the user's local credentials
            newUser.email = profile.emails[0].value;
            newUser.name.user = profile.username;
            newUser.name.first = profile.displayName.split(" ")[0];
            newUser.name.last = profile.displayName.split(" ")[1];
            newUser.image = profile.photos[0].value;
            newUser.strategy.push("github");
            newUser.enable = false;
            newUser.save(async (err) => {
              if (err) {
                return done(err, false, {
                  Error: `An error occured; ${err}`,
                });
              }
              //Send Welcome Email
              await welcome({
                name: profile.displayName.split(" ")[0],
                email: profile.emails[0].value,
              });
              //Send create new assword mail
              generatePasswordToken(newUser);
              //Send response back
              done(null, newUser);
            });
          }
        } catch (err) {
          done(err, false, {
            message: { detail: `An error occured; ${err}` },
          });
        }
      }
    )
  );

  //LOGIN STRATEGY
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "name",
        passwordField: "password",
      },
      async (name, password, done) => {
        try {
          //Find User in the database using the email or username field
          const user = await User.findOne({
            $or: [{ email: name }, { "name.user": name }],
          });
          //If user does not exist, throw not found error
          if (!user) {
            return done(null, false, {
              message: {
                detail: "User does not exist, please sign up",
                status: "Failed",
              },
            });
          } else {
            if (user.enable == false) {
              done(null, false, {
                message: {
                  detail: "Unauthorised, create a password",
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
                    "Invalid Credentials, please ensure login details are correct",
                  status: "Failed",
                },
              });
            }
            done(null, user);
          }
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
  //Serialize User
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  //Deserialize User
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
