/* Code to allow changing between file upload and linking image. */

// Getting rid of the "$ is not defined" warning
/* global $ */

$(function(){
    $('.urlImage').hide();
    $('.fileImage').hide();
    
    $('select[name="imageupload"]').change(function() 
    {
        var post_type = $(this).find(":selected").val();
        if(post_type === "link")
        {
            $('.urlImage').show();
            $('.fileImage').hide();
        }
        else if(post_type === "file")
        {
            $('.urlImage').hide();
            $('.fileImage').show();
        }
        else
        {
            $('.urlImage').hide();
            $('.fileImage').hide();
        }
    });
    
    $(".btn-info").on("click", function() 
    {
        addComments();
    });
});

// Add comments to all posts.
function addComments()
{
    var post_list = $('#post-list');
    $.get("/posts", function(data) {
        post_list.html(data);
    })
}

// OLD


// $(function(){
//     $('.urlImage').hide();
//     $('.fileImage').hide();
    
//     $('select[name="imageupload"]').change(function() 
//     {
//         var post_type = $(this).find(":selected").val();
//         if(post_type === "link")
//         {
//             $('.urlImage').show();
//             $('.fileImage').hide();
//         }
//         else if(post_type === "file")
//         {
//             $('.urlImage').hide();
//             $('.fileImage').show();
//         }
//         else
//         {
//             $('.urlImage').hide();
//             $('.fileImage').hide();
//         }
//     });
    
//     $(".btn-info").on("click", function() 
//     {
//         addComments();
//     });
// });

// // Add comments to all posts.
// function addComments()
// {
//     var post_list = $('#post-list');
//     $.get("/posts", function(data) {
//         post_list.html(data);
//     })
// }