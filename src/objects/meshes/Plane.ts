import BufferAttribute from "../../renderer/BufferAttribute";
import Mesh from "./Mesh";

/**
 * Mesh representing a flat plane
 */
export default class Plane extends Mesh {
    constructor() {
        super();

        this.createBufferAttribs();
        this.setVertexCount(6);
        this.updateBuffers();
    }

    private createBufferAttribs() {
        const position = new BufferAttribute(0, 3);
        const color = new BufferAttribute(1, 3);
        const uvs = new BufferAttribute(2, 2);

        this.setIndices(new Uint32Array([
            0, 1, 2,
            2, 3, 1
        ]));

        position.setBuffer(new Float32Array([
            -0.5, 0.0,  0.5,
            -0.5, 0.0, -0.5,
             0.5, 0.0, -0.5,
             0.5, 0.0,  0.5
        ]));

        color.setBuffer(new Float32Array([
            1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
        ]));

        uvs.setBuffer(new Float32Array([
            1.0, 1.0,
            1.0, 0.0,
            0.0, 1.0,
            0.0, 0.0,
        ]));

        this.setBufferAttrib("position", position);
        this.setBufferAttrib("color", color);
        this.setBufferAttrib("uvs", uvs);
    }
}