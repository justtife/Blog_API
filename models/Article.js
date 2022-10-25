const mongoose = require("mongoose");
const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Article title is required"],
      unique: [true, "Article title already exist, please enter a new one"],
    },
    description: {
      type: String,
      minlength: [20, "This field should have more than 19 characters"],
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    state: {
      enum: {
        values: ["Draft", "Published"],
        message: "{VALUE} is not supported",
      },
      default: "Draft",
    },
    read_count: {
      type: Number,
      default: 0,
    },
    reading_time: {
      type: Date,
    },
    tags: {
      type: Array,
    },
    body: {
      type: String,
      required: [true, "Article body is required"],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Article", ArticleSchema);
