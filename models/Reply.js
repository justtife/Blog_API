const mongoose = require("mongoose");
const ReplySchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "A comment body is required"],
    },
    comment: {
      type: mongoose.Schema.ObjectId,
      ref: "Comment",
      required: [true, "A comment is required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Login to reply a comment"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reply", ReplySchema);
