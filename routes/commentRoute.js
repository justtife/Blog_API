const commentRoute = require("express").Router();
//Import Comment Controller
const CommentController = require("../controller/commentController");
const { checkRole } = require("../middlewares/authorization");
const { Auth } = require("../middlewares/authentication");

commentRoute
  .route("/:id")
  //Get a single comment
  .get(CommentController.singleComment)
  //Create Comment
  .post(Auth, CommentController.createComment)
  //Delete Comment
  .delete(Auth, CommentController.deleteComment);
//Reply on a comment
commentRoute.route("/:id/reply").post(Auth, CommentController.createReply);
commentRoute
  .route("")
  .get(CommentController.oneArticleComments)
  .delete(Auth, CommentController.deleteReply);
module.exports = commentRoute;
