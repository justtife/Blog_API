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
      required: [true, "Description Field is required"],
      minlength: [20, "This field should have more than 19 characters"],
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      require: [true, "Login to create an article"],
    },
    state: {
      type: String,
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
      type: String,
    },
    tags: {
      type: Array,
    },
    body: {
      type: String,
      required: [true, "Article body is required"],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
ArticleSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "article",
  justOne: false,
});
ArticleSchema.pre("remove", async function () {
  await this.model("Comment").deleteMany({ article: this._id });
});
module.exports = mongoose.model("Article", ArticleSchema);
