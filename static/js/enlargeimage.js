// Zoom into the image.

/* global $ */

$(function()
{
    $('#post-list').on('click', '.post-image', function(e)
    {
        var productOverlay = $('#post-list').find('.product-image-overlay');
        var productOverlayImage = $('#post-list').find('.product-image-overlay img');

        productOverlayImage.attr('src', $(this).attr('src'));
        productOverlayImage.width('70%');
        productOverlayImage.height('70%');
        productOverlay.fadeIn(100);
        $('body').css('overflow', 'hidden');
        $('.product-image-overlay-close').on('click', function () {
        productOverlay.fadeOut(100);
        $('body').css('overflow', 'auto');
    });
    });
});