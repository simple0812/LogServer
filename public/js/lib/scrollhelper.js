
function getScrollTop() {
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
    }
    else if (document.body) {
        scrollTop = document.body.scrollTop;
    }
    return scrollTop;
}

function getScrollTopBy(name) {
    var tag = document.getElementById(name);
    return tag.scrollTop;
}



function getClientHeight() {
    var clientHeight = 0;
    if (document.body.clientHeight && document.documentElement.clientHeight) {
        var clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    }
    else {
        var clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    }
    return clientHeight;
}


function getClientHeightBy(name) {

    var tag = document.getElementById(name);
    var clientHeight = 0;
//    if (tag.clientHeight && document.documentElement.clientHeight) {
//        var clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
//    }
//    else {
//        var clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
//    }
    return tag.clientHeight;
}

function getScrollHeight() {
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
}

function getScrollHeightBy(name)
{
    var tag = document.getElementById(name);
    return tag.scrollHeight;
}


function reachBottom() {
    if ((getScrollTop() + getClientHeight()) / getScrollHeight() >= 1 && getScrollTop()>0) {
        return true;
    } else {
        return false;
    }
}

function reachBottomBy(name) {
    if ((getScrollTopBy(name) + getClientHeightBy(name)) / getScrollHeightBy(name) >= 1 && getScrollTopBy(name)>0) {
        return true;
    } else {
        return false;
    }
}

function getOffset(evt)
{
    var target = evt.target;
    if (target.offsetLeft == undefined)
    {
        target = target.parentNode;
    }
    var pageCoord = getPageCoord(target);
    var eventCoord =
    {
        x: window.pageXOffset + evt.clientX,
        y: window.pageYOffset + evt.clientY
    };
    var offset =
    {
        offsetX: eventCoord.x - pageCoord.x,
        offsetY: eventCoord.y - pageCoord.y
    };
    evt.offsetX = offset.offsetX;
    evt.offsetY = offset.offsetY;
    return offset;
}

function getPageCoord(element)
{
    var coord = {x: 0, y: 0};
    while (element)
    {
        coord.x += element.offsetLeft;
        coord.y += element.offsetTop;
        element = element.offsetParent;
    }
    return coord;
}

