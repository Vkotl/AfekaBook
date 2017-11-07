/* global $ */

$(function(){
    $('#friend-search').on('keyup', function(e)
    {
        var parameters = { search: $(this).val() };
        $.get('/friends', parameters, function(data) 
        {
            if(parameters.search == "")
            {
                // Hide the results popup.
                $('#results').toggleClass("results-hide",true);
            }
            else
            {
                // Set the width of the popup results to match the input.
                $('#results').css('width',$('#friend-search').css('width'));
                // Set the position of the popup results.
                var pos = $('#friend-search').offset();
                $('#results').css({ top: pos.top + $('#friend-search').outerHeight(), left: pos.left });
                // Sent the data to /friends.
                $('#results').html(data);
                // Show the results popup.
                if($('#results li').length > 0)
                {
                    $('#results').toggleClass("results-hide",false);
                }
                else
                {
                    $('#results').toggleClass("results-hide",true);
                }
            }
        });

    });
});