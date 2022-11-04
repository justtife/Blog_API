const commentRoute = require("express").Router();
//Import Comment Controller
const CommentController = require("../controller/commentController");
const passport = require("passport");
//Passport JWT Authentication Middleware
const jwtAuth = passport.authenticate("jwt", { session: false });
commentRoute
  .route("/:id")
  //Create Comment
  .post(CommentController.createComment)
  //Delete Comment
  .delete(jwtAuth, CommentController.deleteComment);
//Reply on a comment
commentRoute.route("/:id/reply").patch(CommentController.createReply);
module.exports = commentRoute;
