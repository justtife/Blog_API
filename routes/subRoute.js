const subRoute = require("express").Router();
const SubscriptionController = require("../controller/planController");
const { Auth } = require("../middlewares/authentication");
subRoute.route("/verify").get(Auth, SubscriptionController.verifyPayment);
subRoute.route("/:plan").get(Auth, SubscriptionController.initializePayment);
module.exports = subRoute;
