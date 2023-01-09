//Access to environment variables
require("dotenv").config();
//Detect Asynchronous Errors
require("express-async-errors");

//Import and Initialize Express module
const express = require("express");
const app = express();

//Cloudinary Configuration
const cloudinary = require("cloudinary");
cloudinary.config(require("./utils/cloudinaryConfig"));

const path = require("path");
const PORT = process.env.APP_PORT || 5050;

//Authentication Modules
const passport = require("passport");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");

//Security Middlewares
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const compression = require("compression");
const session = require("express-session");
//Logger
const expressWinston = require("express-winston");

//Import Passport Configuration
require("./utils/passport")(passport);

//Views
const ejs = require("ejs");
const ejsLayout = require("express-ejs-layouts");

//Initialize Security Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.set("trust proxy", 1);
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(helmet());
app.disable("x-powered-by");
app.use(xss());
app.use(compression());
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);

//Setup Views
//Template engine
app.use(ejsLayout);
app.set("view engine", "ejs");
app.set("layout", "./layout/main");

//Cookie Parser(Signed)
app.use(cookieParser(process.env.JWT_SECRET));

//Initialize session
app.use(
  session({
    name: "ALT_BLOG",
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
      signed: true,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 2 * 60,
    }),
  })
);
//Initialize Passport and Session
app.use(passport.initialize());
app.use(passport.session());

//Logger
const logger = require("./logger/index");
app.use(
  expressWinston.logger({
    winstonInstance: logger,
    statusLevels: true,
  })
);

//Route Endpoints
//Test route
app.get("/", (req, res) => {
  res.json({ Message: "Hello World", Mode: `${process.env.NODE_ENV}` });
});
//Error Route
app.get("/api/v1/error", (req, res) => {
  throw new Error("An error occured");
});
const receiptPDF = require("./utils/createPDF");
app.get("/pay", (req, res) => {
  receiptPDF({
    discount: 10,
    real: 1000,
    date: "Tuesday",
    subID: 12345,
    email: "farinubolu@gmail.com",
  });
});


// User Routes
app.use("/api/v1", require("./routes/userRoute"));
// Article Routes
app.use("/api/v1/article", require("./routes/blogRoute"));
// Comment Routes
app.use("/api/v1/comment", require("./routes/commentRoute"));
//Subscribe to an author
app.use("/api/v1/subscribe", require("./routes/followRoute"));
// Subscription Payment and Verification
app.use("/api/v1/subscription", require("./routes/subRoute"));
//View Routes
app.use("/", require("./routes/viewRoute"));

//Error Handler Logger
app.use(
  expressWinston.errorLogger({
    winstonInstance: logger,
    statusLevels: true,
  })
);

//Initialize Manual Middlewares
//Not Found Middleware
app.use(require("./middlewares/notFound"));
//Error Handler Middleware
app.use(require("./middlewares/errorHandler"));

//Connect to database and start server
const connectDB = require("./db/connect");
const start = async () => {
  //Check if not in test mode
  if (process.env.NODE_ENV != "test") {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, (err) => {
      if (err) throw err;
      logger.info(
        `Server started in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
    });
  }
};
start();

module.exports = app;
