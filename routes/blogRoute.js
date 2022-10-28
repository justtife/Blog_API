const blogRoute = require("express").Router();
const passport = require("passport");
const jwtAuth = passport.authenticate("jwt", { session: false });
const BlogController = require("../controller/blogController");
blogRoute.post("/create", jwtAuth, BlogController.createArticle);
blogRoute.route("/my-artcicle").get(jwtAuth, BlogController.myArticles);
blogRoute.get("/all", BlogController.allArticles);
blogRoute
  .route("/:id")
  .get(BlogController.readSingleArticle)
  .patch(jwtAuth, BlogController.updateArticle)
  .delete(jwtAuth, BlogController.deleteArticle);
module.exports = blogRoute;
