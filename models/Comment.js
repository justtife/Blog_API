const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A comment title is required"],
    },
    body: {
      type: String,
      required: [true, "A comment body is required"],
    },
    article: {
      type: mongoose.Schema.ObjectId,
      ref: "Article",
      required: [true, "An article is needed"],
    },
    user: {
      type: String,
      required: [true, "Login to create an article"],
    },
    replies: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Comment", CommentSchema);
