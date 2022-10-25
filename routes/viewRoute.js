const viewRoute = require("express").Router();


viewRoute.get("/home",(req,res)=>{
    res.render("login.ejs")
})
module.exports = viewRoute;
