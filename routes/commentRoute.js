const commentRoute = require("express").Router();
const CommentController = require("../controller/commentController");
const passport = require("passport");
const jwtAuth = passport.authenticate("jwt", { session: false });
commentRoute.post("/:id", jwtAuth, CommentController.createComment);
commentRoute.patch("/:id/reply", CommentController.createReply);
module.exports = commentRoute;
