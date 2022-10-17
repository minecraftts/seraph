# Seraph

Seraph is a simple and small OpenGL renderer for Node.js.

### Notice
Seraph is currently not stable, API will change without a major version bump. Deprecations may or may not be present before a class/method/namespace/type undergoes breaking changes.

## Installation

You will CMake as well as any other C++ build tools installed as Seraph uses native modules which must be built.

After installing C++ build tools you can go ahead and run
```sh
npm install @minecraftts/seraph --save
```

## Quick Start

While Seraph is somewhat more verbose than other 3D libraries for JavaScript it gives you a ton of control, including adding your own OpenGL code during rendering.

### Canvas

Canvas is the easiest to use, but also quite a bit slower than OpenGL as it is software rendered

**Example:**

```ts
import { Seraph, CanvasDisplay } from "@minecraftts/seraph";

// initialize the engine, this must be done before anything else
Seraph.initialize();

// create a canvas display, this is our canvas/window
const display = new CanvasDisplay();

// get the window context
let context = display.getGraphics();

// we need to get a new context everytime the window resizes due to the old one being deleted
display.on("resize", () => { context = display.getGraphics() });

// finally show our window and start our game loop
display.show();

while (!display.shouldClose()) {
    // poll events (keyboard input, window events, etc)
    display.pollEvents();

    // set the fill color to white
    context.fillStyle = "white";
    // fill our background
    context.fillRect(0, 0, display.getWidth(), display.getHeight());
    // set the fill color to black
    context.fillStyle = "black";
    // set the font
    context.font = "48px serif";
    // finally draw text
    context.fillText("Hello Seraph", 10, 50);

    // swap buffers so what we just drew is visible on the screen
    display.swapBuffers();
}
```

### OpenGL

```ts
import { Seraph, Display, Plane, Renderer, Scene, UnlitMaterial, PerspectiveCamera, MathUtil } from "@minecraftts/seraph";

// initialize the engine, this must be done before anything else
Seraph.initialize();

// create a display, this is our window
const display = new Display();
// create a renderer, this will draw into our window
const renderer = new Renderer();
// create a scene, the renderer will draw all objects added to the scene
const scene = new Scene();
// create a camera
const camera = new PerspectiveCamera();

// create a mesh
const floor = new Plane();

// assign a new unlit material to the mesh
floor.setMaterial(new UnlitMaterial());

// move the camera up by 2 units
camera.setPosition(0, 2, 0);
// set the aspect ratio
camera.setAspectRatio(display.getWidth() / display.getHeight());
// finally rotate the camera downwards
camera.rotate(-MathUtil.degreesToRad(90), 0, 0);

// if the display resizes we need to set the aspect ratio again or else the projection will be messed up
display.on("resize", (width, height, aspect) => { camera.setAspectRatio(aspect) });

// add the floor mesh to the scene
scene.add(floor);

// set the background color
renderer.setClearColor(0.2, 0.3, 0.7);

// finally show the window and start our game loop
display.show();

while (!display.shouldClose()) {
    // poll events (keyboard input, window events, etc)
    display.pollEvents();

    // draw our scene
    renderer.draw(scene, camera);

    // finally swap the front and back buffer so it's visible on the screen
    display.swapBuffers();
}
```

## License

Seraph is licensed under the MIT license.