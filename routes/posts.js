var express     = require("express"),
    Post        = require("../models/post"),
    Comment     = require("../models/comment"),
// Requires "index.js" automatically.
    middleware  = require("../middleware"),
    formidable  = require("formidable"),
    helpers = require("../static/js/requirehelpers");
var router      = express.Router();

// INDEX
router.get("/", middleware.isLoggedIn, function(req, res){
    //Get all posts from DB
    Post.find({}, function(err, allPosts){
        if(err)
        {
            console.log(err);
        }
        else
        {
            allPosts.sort(function(a,b) {return b.date - a.date});
            res.render("posts/postlist", {posts: allPosts, csrf: req.csrfToken()});
        }
    });
});

// Like
router.post("/:id/like", middleware.isLoggedIn, function(req, res) 
{
     Post.findById(req.params.id, function(err, foundPost){
        if(err)
        {
            console.log(err);
        }
        else
        {
            // Find the index of the user in the likes array, -1 otherwise.
            var index = foundPost.likes.users.findIndex(i =>req.user._id.equals(i.id));
            
            
            // User did not like the post previously.
            if(index === -1)
            {
                foundPost.likes.amount++;
                foundPost.likes.users.push({id: req.user._id, username: req.user.username});
            }
            // User has already liked the post.
            else
            {
                foundPost.likes.amount--;
                // Remove the user entry from the likes array.
                foundPost.likes.users.splice(index);
            }
            foundPost.save();
            res.send((foundPost.likes.amount>0) ? foundPost.likes.amount + " likes" : "");
        }
    });
});

// Share
router.post("/:id/share", middleware.isLoggedIn, function(req, res) 
{
    var postdata = {};
    Post.findById(req.params.id, function(err, foundPost){
        if(err)
        {
            console.log(err);
        }
        else
        {
            var author = {
                id: req.user._id,
                username: req.user.username
            }
            var likes = {
                amount: 0,
                users: []
            };
            var date = new Date(Date.now() + 10800000);
            postdata = { author: author, likes: likes, date: date, image: foundPost.image, description: foundPost.description, personal: foundPost.personal === "private" };
            helpers.postFunctionsObj.createNewPost(res, postdata);
        }
    });
});

// CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to posts array.
    var postdata = {};
    var image = "";
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var likes = {
        amount: 0,
        users: []
    };
    
    // Amount of milliseconds from 1 January 1970 00:00:00 UTC added with 3 more hours for local time.
    var date = new Date(Date.now() + 10800000);

    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if(err)
        {
            console.log("Error in parse.")
            console.log(err);
        }
        else
        {
            postdata = { author: author, likes: likes, date: date, description: fields.description, personal: fields.privacy === "private" };
            if(fields.imageupload !== "file")
            {
                postdata.image = fields.image;
                helpers.postFunctionsObj.createNewPost(res, postdata);
            }
            else
            {
                // Callback function for synchronous
                helpers.postFunctionsObj.fileUpload(req, res, files, function(imageToSave){
                    postdata.image = imageToSave;
                    helpers.postFunctionsObj.createNewPost(res, postdata);
                });
            }
        }
    });
});

// NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("posts/new", { csrf: req.csrfToken() });
});

//SHOW - shows more info about one post.
router.get("/:id", function(req, res) {
    // Find the post with provided ID
    Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
       if(err || !foundPost)
       {
           req.flash("error", "Post not found.");
           res.redirect("back");
       }
       else
       {
            // Render show template with that post.
            res.render("posts/comments", {post: foundPost, csrf: req.csrfToken()});
       }
    });
});

// EDIT POST ROUTE
router.get("/:id/edit", middleware.checkPostOwnership,function(req, res) {
    Post.findById(req.params.id, function(err, foundPost){
         if(err || !foundPost)
         {
            req.flash("error", "Post not found.");
            res.redirect("back");
         }
         else
         {
             res.render("posts/edit", {post: foundPost, csrf: req.csrfToken()});
         }
        
    });
});
// UPDATE POST ROUTE
router.put("/:id", middleware.checkPostOwnership, function(req, res){
   // find and update the correct post.
   Post.findById(req.params.id, function(err, postToUpdate){
       if(err)
       {
           res.redirect("/index");
       }
       else
       {
            var image = "";
            var author = {
                id: req.user._id,
                username: req.user.username
            }
            
            var form = new formidable.IncomingForm();
            form.parse(req, function(err, fields, files) {
                if(err)
                {
                    console.log("Error in parse.")
                    console.log(err);
                }
                else
                {
                    postToUpdate.author = author;
                    postToUpdate.description = fields.description;
                    
                    
                    postToUpdate.personal = fields.privacy === "private";
                    
                    if(fields.imageupload !== "file")
                    {
                        if(!fields.image == "")
                        {
                            if(postToUpdate.image.split("/")[1] == "uploads")
                            {
                                helpers.postFunctionsObj.deleteFile(postToUpdate.image, true);
                            }
                            postToUpdate.image = fields.image;
                        }
                        else if(fields.imageupload === "noimage")
                        {
                            if(postToUpdate.image.split("/")[1] == "uploads")
                            {
                                helpers.postFunctionsObj.deleteFile(postToUpdate.image, true);
                            }
                            postToUpdate.image = "";
                        }
                        postToUpdate.save();
                    }
                    else
                    {
                        if(files.image)
                        {
                            helpers.postFunctionsObj.deleteFile(postToUpdate.image, true);
                            // Callback function for synchronous work.
                            helpers.postFunctionsObj.fileUpload(req, res, files, function(imageToSave){
                                postToUpdate.image = imageToSave;
                                postToUpdate.save();
                            });
                        }
                    }
                }
            });
            res.redirect("/index");
       }
   });
});

// DESTROY POST ROUTE ---- Deletes the post, as well as the image it has and all the comments it has.
router.delete("/:id", middleware.checkPostOwnership, function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if(err)
        {
            console.log(err);
        }
        else
        {
            if(foundPost.image != "" && foundPost.image.split("/")[1] == "uploads")
            {
                helpers.postFunctionsObj.deleteFile(foundPost.image);
            }
            if(foundPost.comments.length > 0)
            {
                foundPost.comments.forEach(function(comment){
                    Comment.findByIdAndRemove(comment, function(err){
                        if(err)
                        {
                            console.log("Error in removing the comment " + comment.id + "from the post before deletion.");
                        }
                    }); 
                });
            }
            foundPost.remove(function()
            {
                res.redirect("/posts");
            });
        }
    });
});

module.exports = router;