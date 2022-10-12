import BufferAttribute from "../../renderer/BufferAttribute";
import Mesh from "./Mesh";

/**
 * Mesh representing a full-size 2d screen
 */
export default class Screen extends Mesh {
    private width: number;
    private height: number;

    constructor() {
        super();

        this.width = 0;
        this.height = 0;

        this.createBufferAttribs();
        this.setVertexCount(6);
        this.updateBuffers();
    }

    private createBufferAttribs() {
        const position = new BufferAttribute(0, 2);
        const color = new BufferAttribute(1, 3);
        const uvs = new BufferAttribute(2, 2);

        position.setBuffer(new Float32Array([
            1.0,  1.0,
            1.0, -1.0,
           -1.0,  1.0,

            1.0, -1.0,
           -1.0, -1.0,
           -1.0, 1.0
        ]));

        color.setBuffer(new Float32Array([
            1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,

            1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, 1.0
        ]));

        uvs.setBuffer(new Float32Array([
            1.0, 0.0,
            1.0, 1.0,
            0.0, 0.0,
            
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0
        ]));

        this.setBufferAttrib("position", position);
        this.setBufferAttrib("color", color);
        this.setBufferAttrib("uvs", uvs);
    }

    public setWidth(width: number): void {
        this.width = width;
        this.createBufferAttribs();
        this.updateBuffers();
    }

    public setHeight(height: number): void {
        this.height = height;
        this.createBufferAttribs();
        this.updateBuffers();
    }
}