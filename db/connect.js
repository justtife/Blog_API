const mongoose = require("mongoose");

const connectDB = async (url) => {
  try {
    //Connect to database
    await mongoose.connect(url);
    console.log(`Database Connected`);
  } catch (err) {
    //Return Error if error exist
    console.error(`Database Error: ${err}`);
    process.exit(1);
  }
};

module.exports = connectDB;
