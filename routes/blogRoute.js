const blogRoute = require("express").Router();
const passport = require("passport");
//Passport jwt middleware
const jwtAuth = passport.authenticate("jwt", { session: false });
//Import blog controller
const BlogController = require("../controller/blogController");
//Create Article Route
blogRoute.route("/create").post(jwtAuth, BlogController.createArticle);
//User created Articles Route
blogRoute.route("/my-articles").get(jwtAuth, BlogController.myArticles);
//All published articles Route
blogRoute.route("/all").get(BlogController.allArticles);
blogRoute
  .route("/:id")
  //Single Article Route
  .get(BlogController.readSingleArticle)
  //Publish Article
  .patch(jwtAuth, BlogController.updateArticle)
  //Delete Article
  .delete(jwtAuth, BlogController.deleteArticle);
//Edit Article
blogRoute.route("/:id/edit").patch(jwtAuth, BlogController.editArticle);
module.exports = blogRoute;
