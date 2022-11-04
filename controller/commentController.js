const Comment = require("../models/Comment");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Article = require("../models/Article");
const { verify } = require("jsonwebtoken");
const _ = require("lodash");
const refreshTokenOnRequest = require("../utils/refreshToken");
module.exports = class CommentAPI {
  static async createComment(req, res) {
    //Refreshes Token on request if user is logged In
    await refreshTokenOnRequest({ req, res, user: req.user });
    const { id: articleID } = req.params;
    const isArticle = await Article.findOne({
      _id: articleID,
      state: "Published",
    });
    if (!isArticle) {
      throw new CustomError.NotFoundError(
        `Article with id:${req.body.article} does not exist or has not been published`
      );
    }
    //Set Request Body Article to article ID
    req.body.article = articleID;
    //Check if user is logged in
    if (req.signedCookies["accessToken"] || req.signedCookies["refreshToken"]) {
      let token =
        req.signedCookies["accessToken"] || req.signedCookies["refreshToken"];
      let payload = verify(token, process.env.JWT_SECRET);
      //Set the request body user to user ID
      req.body.user = payload.user.userID;
    } else {
      //Set the request body user to Anonymous when not logged in
      req.body.user = "Anonymous";
    }
    const comment = await Comment.create(req.body);
    res.status(StatusCodes.CREATED).json({
      message: {
        detail: "Comment Submitted",
        status: "success",
        comment: _.omit(Object.values(comment)[1], ["updatedAt", "__v"]),
      },
    });
  }
  static async deleteComment(req, res) {
    //Refreshes Token on request if user is logged In
    await refreshTokenOnRequest({ req, res, user: req.user });
    const { id: bookID } = req.params;
    const commentExists = await Comment.findOne({
      article: bookID,
      user: req.user._id,
    });
    console.log(commentExists);
    if (!commentExists) {
      throw new CustomError.NotFoundError(
        "No comment of yours was found on this article"
      );
    }

    await commentExists.remove();
    res.status(StatusCodes.OK).json({
      message: { detail: "Comment successfully deleted", status: "success" },
    });
  }
  static async createReply(req, res) {
    //Refreshes Token on request if user is logged In
    await refreshTokenOnRequest({ req, res, user: req.user });
    const { id: commentID } = req.params;
    const { reply } = req.body;
    if (!reply) {
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
    commentExists.replies.push(reply);
    await commentExists.save();
    res.status(StatusCodes.OK).json({
      message: {
        detail: "Reply submitted successfully",
        status: "success",
      },
    });
  }
};
