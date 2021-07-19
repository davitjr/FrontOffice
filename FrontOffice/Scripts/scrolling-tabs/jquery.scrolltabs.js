var hidWidth;
var scrollBarWidths = 40;

var widthOfList = function (id) {
    var itemsWidth = 0;
    $(id + ' .list li').each(function () {
        var itemWidth = $(this).outerWidth();
        itemsWidth += itemWidth;
    });
    return itemsWidth;
};

var widthOfHidden = function (id) {
    return (($(id + ' .wrapper').outerWidth()) - widthOfList(id) - getLeftPosi(id)) - scrollBarWidths;
};

var getLeftPosi = function (id) {
    return $(id + ' .list').position().left;
};

var reAdjust = function (id) {
    if (($(id + ' .wrapper').outerWidth()) < widthOfList(id)) {
        $(id + ' .scroller-right').show();
    }
    else {
        $(id + ' .scroller-right').hide();
    }

    if (getLeftPosi(id) < 0) {
        $(id + ' .scroller-left').show();
    }
    else {
        $(id + ' .item').animate({ left: "-=" + getLeftPosi(id) + "px" }, 'slow');
        $(id + ' .scroller-left').hide();
    }
}

var leftclick = function (id) {
    if (id!=undefined) {
        $(id + ' .scroller-right').fadeIn('slow');
        $(id + ' .scroller-left').fadeOut('slow');
         
        $(id + ' .list').animate({ left: "-=" + getLeftPosi(id) + "px" }, 'slow', function () {
        });
    }

}


var rightclick = function (id) {
    if (id != undefined) {
        $(id + ' .scroller-left').fadeIn('slow');
        $(id + ' .scroller-right').fadeOut('slow');

        $(id + ' .list').animate({ left: "+=" + widthOfHidden(id) + "px" }, 'slow', function () {

        });
    }
}

//$(window).on('resize', function (e) {
//    reAdjust('');
//});



//$('.scroller-right').click(function () {

//    $('.scroller-left').fadeIn('slow');
//    $('.scroller-right').fadeOut('slow');

//    $('.list').animate({ left: "+=" + widthOfHidden() + "px" }, 'slow', function () {

//    });
//});

//$('.scroller-left').click(function () {

//    $('.scroller-right').fadeIn('slow');
//    $('.scroller-left').fadeOut('slow');

//    $('.list').animate({ left: "-=" + getLeftPosi() + "px" }, 'slow', function () {

//    });
//});



