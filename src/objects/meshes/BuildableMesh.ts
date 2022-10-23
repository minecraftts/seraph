import BufferAttribute from "../../renderer/BufferAttribute";
import DrawType from "./DrawType";
import Mesh from "./Mesh";

export default class BuildableMesh extends Mesh {
    private positions: number[];
    private colors: number[];
    private uvs: number[];

    private lastColor: number[];
    private lastUv: number[];

    private editing: boolean;

    constructor() {
        super();

        this.positions = [];
        this.colors = [];
        this.uvs = [];

        this.lastColor = [0, 0, 0, 1];
        this.lastUv = [0, 0];

        this.editing = false;

        this.setDrawType(DrawType.DYNAMIC);
    }

    /**
     * Clears existing points and begins modifying the shape
     * @returns {void}
     */
    public begin(): void {
        this.positions = [];
        this.colors = [];
        this.uvs = [];
        this.editing = true;
    }

    /**
     * Adds a new vertex to the mesh
     * @param x {number} point's x coordinate
     * @param y {number} point's y coordinate
     * @param z {number} point's z coordinate
     */
    public vertex(x: number = 0, y: number = 0, z: number = 0) {
        if (this.editing) {
            this.uvs.push(...this.lastUv);

            if (this.lastColor.length === 3) {
                this.colors.push(...this.lastColor, 1);
            } else {
                this.colors.push(...this.lastColor);
            }

            this.positions.push(x, y, z);
        }
    }

    /**
     * Sets the next vertex color
     * @param r {number} color's red value
     * @param g {number} color's green value
     * @param b {number} color's blue value
     * @param a {number} color's alpha value
     * @returns {void}
     */
    public color(r: number = 0, g: number = 0, b: number = 0, a: number = 0): void {
        if (this.editing) this.lastColor = [ r, g, b, a ];
    }

    /**
     * Sets the next vertex uv coordinates
     * @param u {number} u coordinate
     * @param v {number} v coordinate
     * @returns {void}
     */
    public uv(u: number = 0, v: number = 0): void {
        if (this.editing) this.lastUv = [ u, v ];
    }

    /**
     * Stops modifying a shape and updates OpenGL buffers
     * @returns {void}
     */
    public end(): void {
        if (this.editing) {
            const positionBuffer = new BufferAttribute(0, 3, false);
            const colorBuffer = new BufferAttribute(1, 4, false);
            const uvBuffer = new BufferAttribute(2, 2, false);

            positionBuffer.setBuffer(new Float32Array(this.positions));
            colorBuffer.setBuffer(new Float32Array(this.colors));
            uvBuffer.setBuffer(new Float32Array(this.uvs));

            this.setBufferAttrib("pos", positionBuffer);
            this.setBufferAttrib("color", colorBuffer);
            this.setBufferAttrib("uv", uvBuffer);

            this.setVertexCount(this.positions.length/3);
            this.updateBuffers();
        } else {
            throw new Error("cannot end editing on a mesh when editing is off.")
        }
    }
}