/* global $ */

$(function()
{
    
    // Add all the comments 
    addComments();
    
    // Clicking on the button to show comments of a specific post.
    $(".thumbnail>button").on('click', function() 
    {
        hideAllComments();
        $('#comments-'+($(this).parent().attr('id'))).show();
    });
    
    // Clicking to turn "Add New Comment" into an input field and then enter to submit to server.
    $(".abrakadabra").on('click', '.new-comment>button', function() 
    {
        $(this).hide();
        $(this).parent().find('.comment-text').show();
    });
    
    // Enter comment content and submit using the return key.
    $(".abrakadabra").on('keyup', '.new-comment>.comment-text', function(e) 
    {
        var key = e.which;
        if(key == 13)
        {
            $(this).parent().find('button').show();
            $(this).hide();
            
            // Get to the abrakadabra parent.
            var post_id = $(this).parentsUntil(".col-md-8").filter(".thumbnail").attr("id");
            
            // Add the CSRF token to the header of the post request.
            $.ajaxSetup({ headers: { "X-CSRF-TOKEN": $(this).parent().find('input[name="_csrf"]').attr("value")}});
            
            $.post("/posts/"+ post_id +"/comments", { "comment": {"text": $(this).val() }}, function(data) {
                $.get("/posts/"+post_id, function(data) 
                {
                    $('#comments-'+post_id).html(data);
                });
            });
        }
    });
    
    // Click the like icon.
    $(".glyphicon-thumbs-up").on('click', function()
    {
        var post_id = $(this).parentsUntil(".col-md-8").filter(".thumbnail").attr("id");
        $(this).toggleClass('blue-like');
        $.ajaxSetup({ headers: { "X-CSRF-TOKEN": $(this).parent().find('input[name="_csrf"]').attr("value")}});
        $.post("/posts/"+ post_id +"/like", function(data) 
        { 
            $("#"+post_id+" .like-amount").html(data); 
        });
    });
    
    // Click the share icon.
    $(".glyphicon-share").on('click', function() {
        var post_id = $(this).parentsUntil(".col-md-8").filter(".thumbnail").attr("id");
        
        $.ajaxSetup({ headers: { "X-CSRF-TOKEN": $(this).parent().find('input[name="_csrf"]').attr("value")}});
        $.post("/posts/"+ post_id +"/share", function(data) 
        {
            var post_list = $('#post-list');
            $.get("/posts", function(data) {
                post_list.html(data);
            });
        });
    });
    
    // Delete a comment.
    $(".abrakadabra").on("click", ".comment-delete",function()
    {
        var post_id = $(this).parentsUntil(".col-md-8").filter(".thumbnail").attr("id");
        var comment_id = $(this).parent().attr("id");
        
        $.ajaxSetup({ headers: { "X-CSRF-TOKEN": $(this).parent().find('input[name="_csrf"]').attr("value")}});
        console.log($(this).parent().find('input[name="_csrf"]'));
        $.post("/posts/" + post_id + "/comments/" + comment_id + "?_method=DELETE", function(data)
        {
            console.log("Finished the delete");
            $.get("/posts/"+post_id, function(data) 
            {
                $('#comments-'+post_id).html(data);
            });
        });
    });
    
    // Edit a comment.
    $(".abrakadabra").on("click", ".comment-edit",function()
    {
        var comment_body = $(this).parent();
        var post_id = $(this).parentsUntil(".col-md-8").filter(".thumbnail").attr("id");
        var comment_id = $(this).parent().attr("id");
        
        $.get("/posts/"+post_id+"/comments/"+comment_id+"/edit", function(data) 
        {
                comment_body.html(data);
        });
        
    });
    
    // Enter comment content and submit using the return key.
    $(".abrakadabra").on('keyup', '.comment-text-edit', function(e) 
    {
        console.log("sdsadas");
        var key = e.which;
        if(key == 13)
        {
            // Get to the abrakadabra parent.
            var post_id = $(this).parentsUntil(".col-md-8").filter(".thumbnail").attr("id");
            var comment_id = $(this).parent().attr("id");
            
            // Add the CSRF token to the header of the post request.
            $.ajaxSetup({ headers: { "X-CSRF-TOKEN": $(this).parent().find('input[name="_csrf"]').attr("value")}});
            
            $.post("/posts/"+ post_id +"/comments/"+comment_id+"?_method=PUT", { "comment": {"text": $(this).val() }}, function(data) {
                $.get("/posts/"+ post_id, function(data) 
                {
                    $('#comments-'+post_id).html(data);
                });
            });
        }
    });
    
});

// Add comments to all posts.
function addComments()
{
    var posts = $('.thumbnail').get();
    
    posts.forEach(function(post) {
       var post_id = $(post).attr('id');
        $.get("/posts/"+post_id, function(data) 
        {
            $('#comments-'+post_id).html(data);
        });
       
    });
}

// Hide all the comments on the page.
function hideAllComments()
{
    var comment_divs = $('.abrakadabra').get();
    
    comment_divs.forEach(function(comment_div) {
       var post_id = $(comment_div).css('display', 'none');
    });
}