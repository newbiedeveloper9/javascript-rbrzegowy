let X = 35;
let Y = 0.2 * window.innerWidth;
let force = 100;
var isInitialized = false;

let balls = [];

class Ball {
    constructor(x, y, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 3 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.y - this.radius < 0 || this.y + this.radius > window.innerHeight) {
            this.vy = -this.vy;
        }
        if (this.x - this.radius < 0 || this.x + this.radius > window.innerWidth) {
            this.vx = -this.vx;
        }
    }
}

function getBall() {
    let x = Math.random() * window.innerWidth;
    let y = Math.random() * window.innerHeight;
    let vx = Math.random() * 4 * (Math.random() < 0.5 ? -1 : 1);
    let vy = Math.random() * 4 * (Math.random() < 0.5 ? -1 : 1);
    let color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    let ball = new Ball(x, y, vx, vy, color);
    ball.radius = 25 * Math.random();
    return ball;
}

function drawFrame() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < balls.length; i++) {
        let ball = balls[i];
        ball.move();
        ball.draw(context);
        for (let j = i + 1; j < balls.length; j++) {
            let ball2 = balls[j];
            let distanceX = ball2.x - ball.x;
            let distanceY = ball2.y - ball.y;

            let dist = Math.sqrt(distanceX * distanceX - distanceY * distanceY);
            if (dist <= Y) {
                context.beginPath();
                context.moveTo(ball.x, ball.y);
                context.lineTo(ball2.x, ball2.y);
                context.stroke();
            }
        }
    }
    requestAnimationFrame(drawFrame);
}

for (let i = 0; i < X; i++) {
    balls.push(getBall());
}

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let start = document.getElementById("start");
start.addEventListener("click", function () {
    if (isInitialized)
        return;

    requestAnimationFrame(drawFrame);
    isInitialized = true;
});

let reset = document.getElementById("reset");
reset.addEventListener("click", function () {
    balls = [];
    for (let i = 0; i < X; i++) {
        balls.push(getBall());
    }
});

let xDoc = document.getElementById("x");
xDoc.addEventListener("input", function () {
    X = this.value;
});

let yDoc = document.getElementById("y");
yDoc.addEventListener("input", function () {
    Y = this.value
});

canvas.addEventListener("mousemove", function (event) {
    let mouseX = event.clientX;
    let mouseY = event.clientY;

    for (let i = 0; i < balls.length; i++) {
        let ball = balls[i];
        let distanceX = mouseX - ball.x;
        let distanceY = mouseY - ball.y;
        let dist = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        if (dist < force) {
            ball.vx += distanceX / dist * (force - dist) * 0.01;
            ball.vy += distanceY / dist * (force - dist) * 0.01;
        }
    }
});

let forceInput = document.getElementById("force-value");
forceInput.addEventListener("input", function () {
    force = this.value;
});