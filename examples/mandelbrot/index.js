const path = require("path");
const { Seraph, Display, Screen, Material, Constants, Renderer, Scene, Keyboard } = require("../../build");

Seraph.initialize();

const display = new Display({
    width: 1000,
    height: 720,
    title: "Mandelbrot"
});

const scene = new Scene();
const screen = new Screen();
const material = new Material({
    vertexPath: path.join(Constants.SERAPH_SHADER_DIR, "screen.vsh"),
    fragmentPath: path.join(__dirname, "shaders/mandelbrot.fsh")
});

material.registerUniform("u_resolution", "vec2");
material.registerUniform("u_zoom_center", "vec2");
material.registerUniform("u_zoom", "float");

screen.setMaterial(material);
scene.add(screen);

const renderer = new Renderer();

let zoom = 1;
let zoomCenter = new Float32Array([0, 0]);

display.on("mouse_scroll", (x, y) => {
    if (y > 0) {
        zoom /= 1.1;
    } else {
        zoom *= 1.1;
    }
});

const speed = 0.05;
const targetUpdates = 1000 / 20;

let lastTime = performance.now();
let lastSec = performance.now();
let fps = 0;

display.setVsync(false);

while (!display.shouldClose()) {
    display.pollEvents();

    const delta = (performance.now() - lastTime) / targetUpdates;

    lastTime = performance.now();

    material.setUniform("u_resolution", new Float32Array([ display.getWidth(), display.getHeight() ]));
    material.setUniform("u_zoom_center", zoomCenter);
    material.setUniform("u_zoom", zoom);

    if (display.getKeyDown(Keyboard.Keys.W)) {
        zoomCenter[1] += speed * zoom * delta;
    }

    if (display.getKeyDown(Keyboard.Keys.A)) {
        zoomCenter[0] -= speed * zoom * delta;
    }

    if (display.getKeyDown(Keyboard.Keys.S)) {
        zoomCenter[1] -= speed * zoom * delta;
    }

    if (display.getKeyDown(Keyboard.Keys.D)) {
        zoomCenter[0] += speed * zoom * delta;
    }

    renderer.draw(scene);

    if (performance.now() - lastSec >= 1000) {
        display.setTitle(`Mandlebrot | FPS: ${fps}`);
        lastSec = performance.now();
        fps = 0;
    }

    fps++;

    display.swapBuffers();
}