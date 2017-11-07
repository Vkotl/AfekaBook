var Post = require("../models/post"),
    Comment = require("../models/comment"),
    csrf = require('csurf');

// All the middleware
var middlewareObj = {};

// Check if the user is logged in.
middlewareObj.isLoggedIn = function(req, res, next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    // Display a flash error that the user is not logged in.
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
}

// Check if the user is logged in and if they own the post.
middlewareObj.checkPostOwnership = function(req, res, next) 
{
    if(req.isAuthenticated())
    {
        // does user own post?
        Post.findById(req.params.id, function(err, foundPost){
            if(err)
            {
                req.flash("error", "Post not found.");
                res.redirect("back");
            }
            else
            {   
                if(foundPost.author.id.equals(req.user._id))
                {
                    next();
                }
                else
                {
                    req.flash("error", "You do not have permission to do that.");
                    res.redirect("back");
                }
            }
        });
        // otherwise redirect
    }
    // if not, redirect
    else
    {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};

// Check if the user is logged in and if they own the comment.
middlewareObj.checkCommentOwnership = function(req, res, next)
{
    if(req.isAuthenticated())
    {
        // does user own post?
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment)
            {
                req.flash("error", "Comment not found.");
                res.redirect("back");
            }
            else
            {
                // User ownership of the comment check.
                if(foundComment.author.id.equals(req.user._id))
                {
                    next();
                }
                else
                {
                    req.flash("error", "You do not have permission to do that.");
                    res.redirect("back");
                }
            }
        });
        // otherwise redirect
    }
    // if not, redirect
    else
    {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};

middlewareObj.csrfProtection = csrf();

module.exports = middlewareObj;