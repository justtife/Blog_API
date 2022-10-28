const viewRoute = require("express").Router();

viewRoute.get("/home", (req, res) => {
  res.render("homePage.ejs");
});
module.exports = viewRoute;
