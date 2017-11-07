var express = require("express");
var router = express.Router({mergeParams: true});
var Post = require("../models/post");
var Comment = require("../models/comment");
// Requires "index.js" automatically.
var middleware = require("../middleware");

// Comments create
router.post("/", middleware.isLoggedIn, function(req, res) {
    //lookup post using ID
    Post.findById(req.params.id, function(err, post) {
        if(err)
        {
            console.log(err);
            res.redirect("/posts");
        }
        else
        {
            Comment.create(req.body.comment, function(err, comment){
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    // Add username and ID to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.date = new Date(Date.now() + 10800000);
                    // Save comment.
                    comment.save();
                    post.comments.push(comment);
                    post.save();
                    req.flash("success", "Successfully added a comment!");
                    res.redirect("/posts/");
                }
            });
        }
    })
});

// Comments edit route.
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            res.render("comments/edit", {post_id: req.params.id, comment: foundComment, csrf: req.csrfToken()});
        }
    });
    
});

// Comments update route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err)
       {
           res.redirect("back");
       }
       else
       {
           updatedComment.text = req.body.comment.text;
           updatedComment.save();
           res.redirect("/");
       }
    });
});

// Comment destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    // findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            req.flash("success", "Comment has been deleted.");
            res.redirect("/posts/");
        }
    });
});

module.exports = router;