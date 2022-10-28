//Access to environment variables
require("dotenv").config();
//Detect Async Errors
require("express-async-errors");

//Import and Initialize Express module
const express = require("express");
const app = express();
const path = require("path");
const cloudinary = require("cloudinary");
const PORT = process.env.APP_PORT || 5050;

//Autentication Modules
const passport = require("passport");
const cookieParser = require("cookie-parser");

//Security Middlewares
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const compression = require("compression");
const morgan = require("morgan");

//Passport
const Passport = require("passport");

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
    origin: [`http://localhost:${PORT}`],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(helmet());
app.disable("x-powered-by");
app.use(xss());
app.use(compression());
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000,
//     max: 60,
//   })
// );

//Cloudinary Configuration
const cloudinaryConfig = require("./utils/cloudinaryConfig");
cloudinary.config(cloudinaryConfig);

//Setup Views
//Template engine
app.use(ejsLayout);
app.set("view engine", "ejs");
app.set("layout", "./layout/main");

app.use(cookieParser(process.env.JWT_SECRET));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else if (process.env.NODE_ENV === "production") {
  app.use(morgan("common"));
}

//Initialize Passport
app.use(passport.initialize());

//Route Endpoints
app.use("/", require("./routes/viewRoute"));
app.use("/api/v1", require("./routes/userRoute"));
app.use("/api/v1/article", require("./routes/blogRoute"));
app.use("/api/v1/comment", require("./routes/commentRoute"));

//Initialize Manual Middlewares
app.use(require("./middlewares/notFound"));
app.use(require("./middlewares/errorHandler"));

//Connect to database and start server
const connectDB = require("./db/connect");
const start = async () => {
  await connectDB(process.env.MONGO_URI);
  app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(
      `Server started in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
  });
};
start();
