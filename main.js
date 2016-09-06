var ie = document.all;
var nn = document.getElementById && !document.all;

var isMouseDraggable = true;
var isIpad = false;

var dragging = false;

var mx = 0;
var my = 0;
var tx = 0;
var ty = 0;
var touchx = 0;
var touchy = 0;

var TABMOVE    = 55;
var tabContext = TABMOVE;

var mouse;
var start_x;
var start_y;

var show;

function setup()
{
    var ctl = document.getElementById("controls");
    mouse = document.getElementById("mousebutton");
    bkgnd = document.getElementById("mousebkgnd");
    show  = document.getElementById("mouseshow");

    ctl.style.position="relative";
    ctl.style.top=15;
    if(nn) {
        ctl.style.top=45;
    }

    start_x = bkgnd.offsetLeft+bkgnd.width/2-mouse.width/2;
    start_y = bkgnd.offsetTop+bkgnd.height/2-mouse.height/2;
    move(start_x, start_y);

    var ua = navigator.userAgent.toLowerCase();

    if(ua.search("android") > -1) {
        isIpad = true;
    }
    else
    if(ua.search("ipad") > -1) {
        isIpad = true;
    }
    else
    if(ua.search("ipod") > -1) {
        isIpad = true;
    }
    else {
        document.onmouseup = mouseUp;
    }

    if(isIpad) {
        document.addEventListener("touchstart", mouseDown, false);
        document.addEventListener("touchmove",  mouseMove, false);
        document.addEventListener("touchend",   mouseUp,   false);
    }
    else {
        document.onmousemove = mouseMove;
        document.onmousedown = mouseDown;
    }
}

function move(x,y)
{
    var dx = x-start_x;
    var dy = start_y-y; // computer y lower on screen is higher value

    show.innerHTML = "Move "+x+" "+y+" : "+dx+" "+dy;
    mouse.style.left = x;
    mouse.style.top  = y;

    // Just send move command. dx = 0 and dy = 0 means stop
    //send_moveCommand(dx, dy);
}

function cx_max()
{
    var wd = (bkgnd.width-mouse.width)/2;
    return bkgnd.offsetLeft+bkgnd.width/2 + wd;
}

function cx_min()
{
    var wd = (bkgnd.width-mouse.width)/2;
    return bkgnd.offsetLeft+bkgnd.width/2 - wd;
}

function cy_max()
{
    var wd = (bkgnd.height-mouse.height)/2;
    return bkgnd.offsetTop+bkgnd.height/2 + wd;
}

function cy_min()
{
    var wd = (bkgnd.height-mouse.height)/2;
    return bkgnd.offsetTop+bkgnd.height/2 - wd;
}

function valid(x,y)
{
    var rc = 1;

    x += mouse.width/2;     // x starts at left
    y += mouse.height/2;    // y starts at top

    if (x > cx_max() || x < cx_min()) {
        rc = 0;
    }
    if (y > cy_max() || y < cy_min()) {
        rc = 0;
    }
    return rc;
}

function mouseDown(e)
{
    if(!e) // support both nn and ie event models for currentX/Y
        e = event;

    if(e.button > 1) {
        return false;
    }

    var clientX = e.clientX;
    var clientY = e.clientY;
    
    if(isIpad) {
        if(e.touches.length != 1)
            return false;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    }

    /*
     * if dragging, release and exit.
     */
    if(dragging) {
        if(!isMouseDraggable) {
            mouseUp(e);
        }
        return false;
    }

    var func = nn ? e.target : event.srcElement;
    var tope = nn ? "HTML" : "BODY";

    while(func.tagName != tope)
    {
        if(func.className == "mousebutton")
        {
            // context determines behavior
            //
            if(tabContext == TABMOVE) {
                if(!ie) e.preventDefault();

                tx = mouse.offsetLeft;
                ty = mouse.offsetTop;
                mx = tx-clientX;
                my = ty-clientY;
                touchx = clientX;
                touchy = clientY;

                dragging = true;
                show.innerHTML = "Down "+Math.round(clientX)+" "+Math.round(clientY);
            }

            return false;
        }
        func = nn ? func.parentNode : func.parentElement;
    }
}

function mouseMove(e)
{
    if(!e) {
        // support both nn and ie event models for currentX/Y
        e = event;
    }

    /* debugging only
    var wx = workspace.offsetLeft;
    var wy = workspace.offsetTop;
    wx = e.clientX-wx;
    wy = e.clientY-wy;
    wx = wx > -1 ? wx : 0;
    wy = wy > -1 ? wy : 0;
    */

    var clientX;
    var clientY;

    if(isIpad) {
        //if(e.touches.length != 1) return false;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
        touchx = clientX;
        touchy = clientY;
    }
    else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    var wx = clientX + document.body.scrollLeft;
    var wy = clientY + document.body.scrollTop;

    if(dragging) {
        if(tabContext == TABMOVE) {

            var rx = Math.round(clientX + mx);
            var ry = Math.round(clientY + my);

            if (valid(rx,ry)) {
                move(rx,ry);
            }
            else {
                show.innerHTML = "Event "+rx+" "+ry;
                mouseUp(e);
            }
        }
    }
    return false;
}

function mouseUp(e)
{
    if(!e) {
        // support both nn and ie event models for clientX/Y
        e = event;
    }

    var clientX;
    var clientY;
    
    if(isIpad) {
        //if(e.touches.length != 1) return false;
        clientX = touchx;
        clientY = touchy;
    }
    else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    var rx = clientX + mx;
    var ry = clientY + my;

    dragging = false;

    if(mouse == 0)
        return;

    if(mouse == undefined)
        return;

    if(clientY+document.body.scrollTop < 0)
        return;

    if(tabContext == TABMOVE) {
        move(start_x, start_y);
    }

    if(!ie) e.preventDefault();
    return false;
}

function trunc(ch, str)
{
}

function clickLed0(name)
{
    var led = document.getElementById(name);
    if (led == null) return;

    var on  = led.alt;
    var src = led.src;

    if (on == 1) {
        src = "ledoff.png";
        on = 0;
    }
    else {
        src = "ledon.png";
        on = 1;
    }
    led.src = src;
    led.alt = on;
}

function clickLed1(name)
{
    var led = document.getElementById(name);
    if (led == null) return;

    var on  = led.alt;
    var src = led.src;

    if (on == 1) {
        src = "ledoff.png";
        on = 0;
    }
    else {
        src = "ledon.png";
        on = 1;
    }
    led.src = src;
    led.alt = on;
}

