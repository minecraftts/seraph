import { GL_FLOAT } from "@minecraftts/opengl";
import BufferAttribTypes from "./BufferAttribTypes";

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

    public setBuffer(buffer: Float32Array) {
        this.data = buffer;
    }

    public getBuffer(): Float32Array {
        return this.data;
    }

    public getWidth(): number {
        return this.width;
    }

    public getType(): BufferAttribTypes {
        return this.type;
    }

    public getPosition(): number {
        return this.position;
    }

    public isNormalized(): boolean {
        return this.normalize;
    }
}