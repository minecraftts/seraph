const { Seraph, CanvasDisplay } = require("../../build");
const { GLFW_KEY_ESCAPE, GLFW_KEY_F11 } = require("@minecraftts/glfw");

Seraph.initialize();

const display = new CanvasDisplay(undefined, undefined, "Stars");

let numStars = 600;
let radius = "0." + Math.floor(Math.random() * 9) + 1;
let focalLength = display.getWidth() * 2;
let warp = 0;
let centerX, centerY;

let stars = [], star;
let i;

let ctx;

let interval = 1000 / 40;
let delta, lastSec, then;

let fps = 0;
let frames = 0;

function executeFrame() {
    if (!then) then = Date.now();
    if (!lastSec) lastSec = Date.now();

    drawStars();

    ctx.fillStyle = "white";
    ctx.font = "18px sans-serif";
    ctx.fillText(`FPS: ${fps}`, 10, 20);

    frames++;

    if (Date.now() - lastSec >= 1000) {
        fps = frames;
        frames = 0;
        lastSec = Date.now();
    }

    delta = Date.now() - then;

    if (delta > interval) {
        then = Date.now() - (delta % interval);
        moveStars();
    }
}

function initializeStars() {
    centerX = display.getWidth() / 2;
    centerY = display.getHeight() / 2;

    stars = [];
    for (i = 0; i < numStars; i++) {
        star = {
            x: Math.random() * display.getWidth(),
            y: Math.random() * display.getHeight(),
            z: Math.random() * display.getWidth(),
            o: "0." + Math.floor(Math.random() * 99) + 1
        };
        stars.push(star);
    }
}

function moveStars() {
    for (i = 0; i < numStars; i++) {
        star = stars[i];
        star.z--;

        if (star.z <= 0) {
            star.z = display.getWidth();
        }
    }
}

function drawStars() {
    let pixelX, pixelY, pixelRadius;

    if (warp == 0) {
        ctx.fillStyle = "rgba(5,5,10,1)";
        ctx.fillRect(0, 0, display.getWidth(), display.getHeight());
    }

    ctx.fillStyle = "rgba(209, 255, 255, " + radius + ")";

    for (i = 0; i < numStars; i++) {
        star = stars[i];

        pixelX = (star.x - centerX) * (focalLength / star.z);
        pixelX += centerX;
        pixelY = (star.y - centerY) * (focalLength / star.z);
        pixelY += centerY;
        pixelRadius = 1 * (focalLength / star.z);

        ctx.fillRect(pixelX, pixelY, pixelRadius, pixelRadius);
        ctx.fillStyle = "rgba(209, 255, 255, " + star.o + ")";
    }
}

initializeStars();

display.on("resize", () => {
    ctx = display.getGraphics();
    initializeStars();
});

display.show();
ctx = display.getGraphics();

display.on("key_press", (keycode) => {
    if (keycode === GLFW_KEY_ESCAPE) {
        display.close();
    }
});

while (!display.shouldClose()) {
    display.pollEvents();

    executeFrame();

    display.swapBuffers();
}