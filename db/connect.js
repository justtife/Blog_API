const mongoose = require("mongoose");
const logger = require("../logger/index");

const connectDB = async (url) => {
  try {
    //Connect to database
    await mongoose.connect(url);
    logger.info(`Database Connected`);
  } catch (err) {
    //Return Error if error exist
    logger.error(`Database Error: ${err}`);
    process.exit(1);
  }
};

module.exports = connectDB;
