import { GL_FLOAT } from "@minecraftts/opengl";
import BufferAttribTypes from "./BufferAttribTypes";

/**
 * Specifies an attribute on a mesh
 */
export default class BufferAttribute {
    private data: Float32Array = new Float32Array(0);

    private width: number;
    private position: number;
    private type: BufferAttribTypes;
    private normalize: boolean;

    constructor(position: number, width: number, normalize: boolean = false) {
        this.type = GL_FLOAT;
        this.width = width;
        this.position = position;
        this.normalize = normalize;
    }

    /**
     * Sets the attribute's data
     * @param buffer the new buffer
     */
    public setBuffer(buffer: Float32Array) {
        this.data = buffer;
    }

    /**
     * @returns the attribute's data
     */
    public getBuffer(): Float32Array {
        return this.data;
    }

    /**
     * @returns the width of a single element
     */
    public getWidth(): number {
        return this.width;
    }

    /**
     * @returns the attribute's type 
     */
    public getType(): BufferAttribTypes {
        return this.type;
    }

    /**
     * @returns the attribute's location
     */
    public getPosition(): number {
        return this.position;
    }

    /**
     * @returns whether or not the attribute is normalized 
     */
    public isNormalized(): boolean {
        return this.normalize;
    }
}