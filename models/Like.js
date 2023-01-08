const mongoose = require("mongoose");
const LikeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectID,
    ref: "user",
    require: [true, "User not logged in"],
  },
});
module.exports = mongoose.model("Like", LikeSchema);
