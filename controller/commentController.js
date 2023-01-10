const Comment = require("../models/Comment");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Article = require("../models/Article");
const Reply = require("../models/Reply");
const _ = require("lodash");
const refreshTokenOnRequest = require("../utils/refreshToken");
const { checkPermission } = require("../middlewares/authorization");
module.exports = class CommentAPI {
  static async createComment(req, res) {
    //Refreshes Token on request if user is logged In
    await refreshTokenOnRequest({ req, res });
    const { content } = req.body;
    const { id: articleID } = req.params;
    if (!content || !articleID) {
      throw new CustomError.BadRequestError("Invalid Request");
    }
    const isArticle = await Article.findOne({
      _id: articleID,
      state: "publish",
    });
    if (!isArticle) {
      throw new CustomError.NotFoundError(
        `Article with id:${req.body.article} does not exist or has not been published`
      );
    }
    if (isArticle.author.toString() === req.user._id.toString()) {
      throw new CustomError.BadRequestError(
        "You cannot write a comment on your article"
      );
    }
    req.body.user = req.user._id;
    req.body.article = articleID;
    const comment = await Comment.create(req.body);
    res.status(StatusCodes.CREATED).json({
      message: {
        detail: "Comment Submitted",
        status: "success",
        comment: _.omit(Object.values(comment)[1], ["updatedAt", "__v"]),
      },
    });
  }
  static async singleComment(req, res) {
    const { id: commentID } = req.params;
    if (!commentID) {
      throw new CustomError.BadRequestError("Invalid Request");
    }
    // Get Comment by Id
    const comment = await Comment.findOne({ _id: commentID })
      .populate({
        path: "replies",
        select: "content user",
      })
      .select("-updatedAt -__v");
    res.status(StatusCodes.OK).json({
      message: {
        detail: `Comment with id:${commentID}`,
        status: "Success",
        comment,
      },
    });
  }
  static async oneArticleComments(req, res) {
    const { article: articleID } = req.query;
    if (!articleID) {
      throw new CustomError.BadRequestError("Invalid Request");
    }
    const comments = await Comment.find({ article: articleID })
      .populate({
        path: "replies",
        select: "content user",
      })
      .select("-updatedAt -__v");
    if (!comments) {
      throw new CustomError.NotFoundError("No comment is found");
    }
    res.status(StatusCodes.OK).json({
      message: {
        detail: `Comments of article with id:${articleID}`,
        status: "Success",
        comments,
      },
    });
  }
  static async deleteComment(req, res) {
    //Refreshes Token on request if user is logged In
    await refreshTokenOnRequest({ req, res });
    const { id: commentID } = req.params;
    const commentExists = await Comment.findOne({ _id: commentID });
    if (!commentExists) {
      throw new CustomError.NotFoundError(
        "No comment was found on this article"
      );
    }
    checkPermission(req.user, commentExists.user);
    await commentExists.remove();
    res.status(StatusCodes.OK).json({
      message: { detail: "Comment successfully deleted", status: "success" },
    });
  }
  static async createReply(req, res) {
    //Refreshes Token on request if user is logged In
    await refreshTokenOnRequest({ req, res });
    const { id: commentID } = req.params;
    const { content } = req.body;
    if (!content) {
      throw new CustomError.BadRequestError(
        "Invalid Request, please write a reply"
      );
    }
    const commentExists = await Comment.findById({ _id: commentID });
    if (!commentExists) {
      throw new CustomError.NotFoundError(
        `Comment with id:${commentID} does not exist`
      );
    }
    req.body.comment = commentID;
    req.body.user = req.user._id;
    await Reply.create(req.body);
    res.status(StatusCodes.OK).json({
      message: {
        detail: "Reply submitted successfully",
        status: "Success",
      },
    });
  }
  static async deleteReply(req, res) {
    const { reply: replyID } = req.query;
    const reply = await Reply.findOne({ _id: replyID });
    checkPermission(req.user, reply.user);
    await reply.remove();
    res.status(StatusCodes.OK).json({
      message: { detail: "Reply successfully deleted", status: "Success" },
    });
  }
};
