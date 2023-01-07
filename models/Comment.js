const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema(
  {
    content: {
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
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
//Populate Comment with replies made on a comment
CommentSchema.virtual("replies", {
  ref: "Reply",
  localField: "_id",
  foreignField: "comment",
  justOne: false,
});

//Delete All articles related to this article on delete of this article
CommentSchema.pre("remove", async function () {
  await this.model("Reply").deleteMany({ comment: this._id });
});
module.exports = mongoose.model("Comment", CommentSchema);
