// fielduser.ejs
// router.get("/fielduser", function(req, res) 


var express = require("express");
var router = express.Router();
var passport    = require("passport"),
    User        = require("../models/user"),
    Comment     = require("../models/comment"),
    middleware = require("../middleware");

// Root route
router.get("/", function(req, res)
{
    res.render("explanation");
});

router.get("/index", middleware.isLoggedIn, function(req,res)
{
    res.render("posts/index.ejs");
});

// Show register form
router.get("/register", function(req, res) {
    res.render("register", {csrf: req.csrfToken()});
});

// Handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username, lowerusername: req.body.username.toLowerCase()});
    User.register(newUser, req.body.password, function(err, user){
        if(err)
        {
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req,res, function(){
            req.flash("success", "Welcome to AfekaBook " + user.username);
            res.redirect("/index");
        });
    });
});

// Show login form
router.get("/login", function(req, res) {
    res.render("login", {csrf: req.csrfToken()});
});

// Handling login logic.
router.post("/login", passport.authenticate("local", 
    { 
        successRedirect: "/index",
        failureRedirect: "/login",
        failureFlash: "Invalid username or password",
        successFlash: "Welcome!"
    }), function(req, res) {
});

// Logout
router.get("/logout", function(req, res) {
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/");
});

module.exports = router;