const subRoute = require("express").Router();
const SubscriptionController = require("../controller/planController");
subRoute.route("/verify").get(SubscriptionController.verifyPayment);
subRoute.route("/:plan").get(SubscriptionController.initializePayment);
module.exports = subRoute;
