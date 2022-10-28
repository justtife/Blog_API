const Comment = require("../models/Comment");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Article = require("../models/Article");
module.exports = class CommentAPI {
  static async createComment(req, res) {
    const { id: articleID } = req.params;
    const isArticle = await Article.findById({
      _id: articleID,
    });
    if (!isArticle) {
      throw new CustomError.NotFoundError(
        `Article with id:${req.body.article} does not exist`
      );
    }
    req.body.article = articleID;
    await Comment.create(req.body);
    res.status(StatusCodes.CREATED).json({ message: "Comment created" });
  }
  static async createReply(req, res) {
    const { id: commentID } = req.params;
    const { reply } = req.body;
    const commentExists = await Comment.findById({ _id: commentID });
    if (!commentExists) {
      throw new CustomError.NotFoundError(
        `Comment with id:${commentID} does not exist`
      );
    }
    commentExists.replies.push(reply);
    await commentExists.save();
    res
      .status(StatusCodes.OK)
      .json({ message: "Reply submitted successfully" });
  }
};
