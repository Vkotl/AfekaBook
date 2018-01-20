var express = require("express"),
    router  = express.Router(),
    User    = require("../models/user"),
    helpers = require("../static/js/requirehelpers");

router.get("/", function(req, res) {
    var val = req.query.search;
    User.find({}, null, {sort: {username: 1}},function(err, allUsers) {
        if(err)
        {
            console.log("Problem finding all users to show for friendship.");
            res.redirect("/");
        }
        else
        {
            var users = [];
            if(val == "*")
            {
                users = allUsers;
            }
            else
            {
                allUsers.forEach(function(user) 
                {
                    if(user.lowerusername.indexOf(val) === 0)
                    {
                        if(!helpers.checkInFriendsObj.checkInFriends(req.user, user))
                            users.push(user);
                    }
                });
            }
            res.render("friends/friendlist", {users: users});
        }
    });
   
});

router.get("/", function(req, res) {
    var val = req.query.search;
    User.find({}, null, {sort: {username: 1}},function(err, allUsers) {
        if(err)
        {
            console.log("Problem finding all users to show for friendship.");
            res.redirect("/");
        }
        else
        {
            var users = [];
            if(val == "*")
            {
                users = allUsers;
            }
            else
            {
                allUsers.forEach(function(user) 
                {
                    if(user.lowerusername.indexOf(val) === 0)
                    {
                        if (user.lowerusername.indexOf(val) === 0)
                        {
                            if (user.lowerusername.indexOf(val) === 0)
                            {
                                if(!helpers.checkInFriendsObj.checkInFriends(req.user, user))
                                    users.push(user);
                            }
                        }
                    }
                });
            }
            res.render("friends/friendlist", {users: users});
        }
    });
   
});

router.get("/:id", function(req, res)
{
    User.findById(req.params.id, function(err, foundUser){
        if(err)
        {
            req.flash("error", "Such user does not exist");
            res.redirect("/");
        }
        else
        {
            User.findById(req.user._id, function(err, foundMe) {
                if(err)
                {
                    console.log("Damn, can't find myself.");
                }
                else
                {
                    var friend = { id:foundUser._id, username: foundUser.username };
                    foundMe.friends.push(friend);
                    foundMe.save();
                    req.flash("success", "Successfully added a friend!");
                    res.redirect("/index");
                }
            });
        }
    });
});

module.exports = router;