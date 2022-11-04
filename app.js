//Access to environment variables
require("dotenv").config();
//Detect Async Errors
require("express-async-errors");

//Import and Initialize Express module
const express = require("express");
const app = express();

//
//Cloudinary Configuration
const cloudinary = require("cloudinary");
cloudinary.config(require("./utils/cloudinaryConfig"));

const path = require("path");
const PORT = process.env.APP_PORT || 5050;

//Authentication Modules
const passport = require("passport");
const cookieParser = require("cookie-parser");

//Security Middlewares
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const compression = require("compression");
const morgan = require("morgan");

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

//Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else if (process.env.NODE_ENV === "production") {
  app.use(morgan("common"));
}

//Initialize Passport
app.use(passport.initialize());

//Route Endpoints
//Test route
app.get("/api/v1", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});
//API Routes
app.use("/api/v1", require("./routes/userRoute"));
app.use("/api/v1/article", require("./routes/blogRoute"));
app.use("/api/v1/comment", require("./routes/commentRoute"));
//View Route
app.use("/", require("./routes/viewRoute"));

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
      console.log(
        `Server started in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
    });
  }
};
start();

module.exports = app;
