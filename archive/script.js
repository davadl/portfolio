// Initialising the canvas
var canvas = document.querySelector('canvas'),
    ctx = canvas.getContext('2d');

// Setting the width and height of the canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Setting up the letters
var letters = '輸入文字:matrix 矩陣';
letters = letters.split('');

// Setting up the columns
var fontSize = 10,
    columns = canvas.width / fontSize;

// Setting up the drops
var drops = [];
for (var i = 0; i < columns; i++) {
    drops[i] = 1;
}

// Setting up the draw function
function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, .1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < drops.length; i++) {
        var text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillStyle = '#00FFFF';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        drops[i]++;
        if (drops[i] * fontSize > canvas.height && Math.random() > .95) {
            drops[i] = 0;
        }
    }
}

// Loop the animation
setInterval(draw, 33);

(function () {
    var tabs_menu = document.getElementsByClassName("tabs-menu");
    for (var k = 0; k < tabs_menu.length; k++) {
        tabs_menu[k].onclick = js_tabs;
    }
    function js_tabs() {
        var tab_id = this.getAttribute("data-target");
        var tabs_panel = document.getElementsByClassName("tabs-panel");

        for (var i = 0; i < tabs_panel.length; i++) {
            tabs_panel[i].style.display = "none";
            tabs_panel[i].className = tabs_panel[i].className.replace(" animated-tabs fadeInDown", "");
        }
        for (var j = 0; j < tabs_menu.length; j++) {
            tabs_menu[j].className = tabs_menu[j].className.replace(" tabs-menu-active", "");
        }
        this.className += " tabs-menu-active";
        var current_tab = document.getElementById(tab_id);
        current_tab.style.display = "block";
        current_tab.className += " animated-tabs fadeInDown";
        return false;
    }
})();
