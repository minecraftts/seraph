# seraph

Seraph is a work in progress renderer for MinecraftTS

### Installation

You will need all dependencies required by [`@minecraftts/opengl`](https://github.com/minecraftts/opengl) and [`@minecraftts/glfw`](https://github.com/minecraftts/glfw). Then installation is as simple as `npm install @minecraftts/seraph`

### Building

Install all required dependencies via `npm install` then build with `npm run build`

### Usage

While extremely verbose (compared to other 3D engines for JavaScript) this hides away a lot of the ugly OpenGL code you'd otherwise have to deal with.

Example:

```ts
import { GL_FLOAT } from "@minecraftts/opengl";
import Display from "@minecraftts/seraph/Display";
import PerspectiveCamera from "@minecraftts/seraph/objects/cameras/PerspectiveCamera";
import Mesh from "@minecraftts/seraph/objects/Mesh";
import Scene from "@minecraftts/seraph/objects/Scene";
import BufferAttribute from "@minecraftts/seraph/renderer/BufferAttribute";
import UnlitMaterial from "@minecraftts/seraph/renderer/materials/UnlitMaterial";
import Renderer from "@minecraftts/seraph/renderer/Renderer";
import Seraph from "@minecraftts/seraph";
import MathUtil from "@minecraftts/seraph/util/MathUtil";

Seraph.initialize();

const display = new Display(undefined, undefined, "Hello World");
const renderer = new Renderer();
const scene = new Scene();

const positionAttrib = new BufferAttribute(0, 3, false);
const colorAttrib = new BufferAttribute(1, 3, false);

positionAttrib.setBuffer(new Float32Array([
    -0.5, -0.5, 0.0,
     0.5, -0.5, 0.0,
     0.0,  0.5, 0.0,
]));

colorAttrib.setBuffer(new Float32Array([
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,
]));

const mesh = new Mesh();

mesh.setBufferAttrib("pos", positionAttrib);
mesh.setBufferAttrib("color", colorAttrib);
mesh.setVertexCount(3);

mesh.updateBuffers();

const material = new UnlitMaterial();
const camera = new PerspectiveCamera();

camera.setPosition(0, 0, -1);
camera.setAspectRatio(display.getWidth() / display.getHeight());

display.on("resize", (width, height, ratio) => {
    console.log(`window resized to ${width}x${height}`)

    camera.setAspectRatio(ratio);
});

mesh.setMaterial(material);
scene.add(mesh);

display.show();

renderer.setClearColor(0.2, 0.3, 0.7);

while (!display.shouldClose()) {
    display.pollEvents();

    camera.rotate(0, MathUtil.degreesToRad(1), 0);
    renderer.draw(scene, camera);

    display.swapBuffers();
}
```