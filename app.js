require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const path = require("path");

//Security Middlewares
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const compression = require("compression");

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
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);

//Initialize Manual Middlewares
app.use(require("./middlewares/notFound"));
app.use(require("./middlewares/errorHandler"));

//Connect to database and start server
const PORT = process.env.APP_PORT || 5050;
const connectDB = require("./db/connect");
const start = async () => {
  await connectDB(process.env.MONGO_URI);
  app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(
      `Server started in ${process.env_NODE_ENV} mode on port ${PORT}`
    );
  });
};
start();
