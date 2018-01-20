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
    
    // Check if a file was chosen.
    $('input[name="image"][type="file"]').change(function()
    {
        var files = $(this).files;
        var file = files[0];
        if(file == null)
        {
            return alert('No file selected.');
        }
        getSignedRequest(file);
    });
});

// Add comments to all posts.
function addComments()
{
    var post_list = $('#post-list');
    $.get("/posts", function(data) 
    {
        post_list.html(data);
    });
}


function getSignedRequest(file)
{
    var xhr = new XMLHttpRequest();
    
    console.log("### getSignedRequest ###");
    
    // xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
    // xhr.onreadystatechange = () => 
    // {
    //     // State is done.
    //     if(xhr.readyState === 4)
    //     {
    //         // OK status.
    //         if(xhr.status === 200)
    //         {
    //             var response = JSON.parse(xhr.responseText);
    //             // uploadFile(file, response.signedRequest, response.url);
    //         }
    //         else
    //         {
    //             alert('Could not get signed URL.');
    //         }
    //     }
    // };
    xhr.send();
}