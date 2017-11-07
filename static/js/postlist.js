/* global $ */

$(function(){
    
    // Add the post list.
    addPosts();
    
    // Delete post button listener.
    $("#post-list").on('click', ".caption>.btn-danger", function() 
    {
        $.ajaxSetup({ headers: { "X-CSRF-TOKEN": $(this).parent().find('input[name="_csrf"]').attr("value")}});
        var post_id = $(this).parentsUntil(".col-md-8").filter(".thumbnail").attr("id");
        $.post("/posts/" + post_id + "?_method=DELETE", function(data)
        {
            addPosts();
        });
    });
    
    // New post button listener
    $("#new-post-btn").on('click', function()
    {
        
        var new_post = $('#new-post');
        
        // Choose whether to show or hide the new post form.
        if(new_post.text() === "")
        {
            $.get("/posts/new", function(data) {
                new_post.html(data);
                new_post.css("display", "block");
            });
        }
        else
        {
            new_post.html("");
            new_post.css("display", "none")
        }
    });
    
    // Edit post
    $("#post-list").on("click", ".caption>.btn-warning", function()
    {
        $.ajaxSetup({ headers: { "X-CSRF-TOKEN": $(this).parent().find('input[name="_csrf"]').attr("value")}});
        var post_id = $(this).parentsUntil(".col-md-8").filter(".thumbnail").attr("id");
        
        $.get("/posts/"+post_id+"/edit", function(data) {
            $("#"+post_id).html(data);
        });
    });
});

function addPosts()
{
    var post_list = $('#post-list');
    $.get("/posts", function(data) {
        post_list.html(data);
    });
}
