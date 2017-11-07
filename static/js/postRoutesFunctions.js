var formidable  = require("formidable"),
    fs          = require("fs"),
    path        = require("path"),
    Post        = require("../../models/post");

var postFunctionsObj = {};

// Create a new post with the given data.
postFunctionsObj.createNewPost = function(res, postdata)
{
    // Create a new post and save to DB.
    Post.create(postdata, function(err, newlyCreated){
        if(err)
        {
            console.log(err);
        }
        else
        {
            // redirect back to posts page.
            res.redirect("/");
        }
    });
}

postFunctionsObj.fileUpload = function(req, res, files, callback)
{
    // Make sure a file was submitted.
    if(!files.image)
    {
        req.flash("error", "No file was added.");
        return res.redirect("/");
    }
    // `image` is the name of the <input> field of type `file`
    var old_path = files.image.path,
        file_size = files.image.size, 
        file_ext = files.image.name.split('.').pop(),
        index = old_path.lastIndexOf('/') + 1,
        file_name = old_path.substr(index),
        new_path = path.join(process.env.PWD, '/static/uploads/', file_name + '.' + file_ext);
    if(file_ext === "jpg" || file_ext === "jpeg" || file_ext === "bmp" || file_ext === "png")
    {
        fs.readFile(old_path, function(err, data) {
            if(err)
            {
                console.log(err);
            }
            else
            {
                fs.writeFile(new_path, data, function(err) 
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        fs.unlink(old_path, function(err) 
                        {
                            if (err) 
                            {
                                console.log("Failed to upload the file.");
                            } else 
                            {
                                callback("/"+(new_path.split('/').slice(5)).join('/'));
                            }
                        });
                    }
                });
                
            }
        });
    }
    else
    {
        req.flash("error", "Image format was incorrect.");
        res.redirect("/");
    }
}

postFunctionsObj.deleteFile = function(path, edit)
{
    fs.unlink("./static"+path, function(err)
    {
        if(err)
        {
            console.log(err);
            console.log("Failed to delete");
        }
        else
        {
            if(edit)
            {
                console.log("User has edited an image, which deleted it - " + path);
            }
            else
            {
                console.log("User has deleted an image - " + path);
            }
        }
        
    });
}

module.exports = postFunctionsObj;