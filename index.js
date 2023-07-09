// Matrix Animation
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');
let width, height;
let charSize = 15;
let columns;
let matrix;
let frameCount = 0;
const animationSpeed = 10; // Increase this value to slow down the animation

function init() {
    canvas.width = width = window.innerWidth;
    canvas.height = height = window.innerHeight;

    columns = Math.floor(width / charSize);

    matrix = [];
    for (let column = 0; column < columns; column++) {
        matrix[column] = Math.floor(Math.random() * 15) - 1;
    }
}

function draw() {
    if (frameCount % animationSpeed === 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#0F0';
        ctx.font = charSize + 'px monospace';

        for (let column = 0; column < matrix.length; column++) {
            const char = String.fromCharCode(
                Math.floor(Math.random() * 95) + 33
            );
            const x = column * charSize;
            const y = matrix[column] * charSize;

            ctx.fillText(char, x, y);

            if (y >= height && Math.random() > 0.975) {
                matrix[column] = 0;
            }

            matrix[column]++;
        }
    }

    frameCount++;
    requestAnimationFrame(draw);
}

window.addEventListener('resize', init);

init();
draw();

// Tab switching functionality
const tabs = document.querySelectorAll('.tabs-menu');
const panels = document.querySelectorAll('.tabs-panel');

tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        if (tab.classList.contains('tabs-menu-navigate')) {
            e.preventDefault();
            const target = tab.getAttribute('data-target');

            tabs.forEach(t => t.classList.remove('tabs-menu-active'));
            panels.forEach(panel => {
                panel.classList.remove('fadeInDown');
                panel.style.display = 'none';
            });

            tab.classList.add('tabs-menu-active');
            document.getElementById(target).classList.add('fadeInDown');
            document.getElementById(target).style.display = 'block';
        }
    });
});