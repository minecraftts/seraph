import BufferAttribute from "../../renderer/BufferAttribute";
import DrawType from "./DrawType";
import Mesh from "./Mesh";

export default class BuildableMesh extends Mesh {
    private readonly positionElements: 2 | 3 | 4;

    private positions: number[];
    private colors: number[];
    private uvs: number[];

    private lastColor: number[];
    private lastUv: number[];

    private buildableIndices: number[];

    private editing: boolean;

    constructor(positionElements: 2 | 3 | 4 = 3) {
        super();

        this.positionElements = positionElements;

        this.positions = [];
        this.colors = [];
        this.uvs = [];

        this.lastColor = [0, 0, 0, 1];
        this.lastUv = [0, 0];

        this.buildableIndices = [];

        this.editing = false;

        this.setDrawType(DrawType.DYNAMIC);
    }

    /**
     * Clears existing points and begins modifying the shape
     * @returns {BuildableMesh}
     */
    public begin(): BuildableMesh {
        this.buildableIndices = [];
        this.positions = [];
        this.colors = [];
        this.uvs = [];
        this.editing = true;

        return this;
    }

    /**
     * Adds a new vertex to the mesh
     * @param x {number} point's x coordinate
     * @param y {number} point's y coordinate
     * @param z {number} point's z coordinate
     * @param w {number} point's w coordinate
     * @returns {BuildableMesh}
     */
    public vertex(x: number = 0, y: number = 0, z: number = 0, w: number = 1): BuildableMesh {
        if (this.editing) {
            this.uvs.push(...this.lastUv);

            if (this.lastColor.length === 3) {
                this.colors.push(...this.lastColor, 1);
            } else {
                this.colors.push(...this.lastColor);
            }

            switch (this.positionElements) {
                case 2:
                    this.positions.push(x, y);
                    break;
                case 3:
                    this.positions.push(x, y, z);
                    break;
                case 4:
                    this.positions.push(x, y, z, w);
                    break;
            }
        }

        return this;
    }

    /**
     * Sets the next vertex color
     * @param r {number} color's red value
     * @param g {number} color's green value
     * @param b {number} color's blue value
     * @param a {number} color's alpha value
     * @returns {BuildableMesh}
     */
    public color(r: number = 0, g: number = 0, b: number = 0, a: number = 1): BuildableMesh {
        if (this.editing) this.lastColor = [ r, g, b, a ];

        return this;
    }

    /**
     * Sets the next vertex uv coordinates
     * @param u {number} u coordinate
     * @param v {number} v coordinate
     * @returns {BuildableMesh}
     */
    public uv(u: number = 0, v: number = 0): BuildableMesh {
        if (this.editing) this.lastUv = [ u, v ];

        return this;
    }

    /**
     * Adds an index to the mesh
     * @param index {number} vertex index
     * @returns {BuildableMesh}
     */
    public index(index: number): BuildableMesh {
        if (this.editing) this.buildableIndices.push(index);

        return this;
    }

    /**
     * Stops modifying a shape and updates OpenGL buffers
     * @returns {void}
     */
    public end(): void {
        if (this.editing) {
            const positionBuffer = new BufferAttribute(0, this.positionElements);
            const colorBuffer = new BufferAttribute(1, 4);
            const uvBuffer = new BufferAttribute(2, 2);

            positionBuffer.setBuffer(new Float32Array(this.positions));
            colorBuffer.setBuffer(new Float32Array(this.colors));
            uvBuffer.setBuffer(new Float32Array(this.uvs));

            this.setBufferAttrib("pos", positionBuffer);
            this.setBufferAttrib("color", colorBuffer);
            this.setBufferAttrib("uv", uvBuffer);

            this.setIndices(new Uint32Array(this.buildableIndices));

            this.setVertexCount(this.positions.length / this.positionElements);
            this.updateBuffers();
        } else {
            throw new Error("cannot end editing on a mesh that isn't being edited.")
        }
    }
}