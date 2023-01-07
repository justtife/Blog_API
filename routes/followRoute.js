const followRoute = require("express").Router();
const { Auth } = require("../middlewares/authentication");
const SubController = require("../controller/subController");

followRoute.route("/follow/:id").post(Auth, SubController.subscribe);
followRoute.route("/unfollow/:id").patch(Auth, SubController.unsubscribe);
followRoute.route("/following").get(Auth, SubController.checkUserSub);
followRoute.route("/followers").get(Auth, SubController.followers);
module.exports = followRoute;
