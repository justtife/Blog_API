const blogRoute = require("express").Router();
const blogValidation = require("../middlewares/articleValidation");
//Authentication Middleware
const { Auth } = require("../middlewares/authentication");
//Import blog controller
const BlogController = require("../controller/blogController");
const { checkRole } = require("../middlewares/authorization");
//Create Article Route
const upload = require("../utils/multer");
blogRoute
  .route("/create")
  .post(
    [Auth, upload.single("coverImage"), blogValidation],
    BlogController.createArticle
  );
//User created Articles Route
blogRoute.route("/my-articles").get(Auth, BlogController.myArticles);
//All published articles Route
blogRoute.route("/all").get(BlogController.allArticles);
blogRoute
  .route("/:id")
  //Single Article Route
  .get(BlogController.readSingleArticle)
  //Publish Article
  .patch(Auth, BlogController.updateArticle)
  //Delete Article
  .delete(Auth, BlogController.deleteArticle);
//Edit Article
blogRoute.route("/:id/edit").patch(Auth, BlogController.editArticle);
blogRoute
  .route("/:id/lock")
  .patch([Auth, checkRole("admin","owner")], BlogController.lockArticle);
module.exports = blogRoute;
