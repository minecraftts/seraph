import { glBindBuffer, glBindVertexArray, glBufferData, glDeleteBuffers, glDeleteVertexArrays, glDrawArrays, glEnableVertexAttribArray, glGenBuffers, glGenVertexArrays, glVertexAttribPointer, GL_ARRAY_BUFFER, GL_FLOAT, GL_STATIC_DRAW, GL_TRIANGLES } from "@minecraftts/opengl";
import { mat4, vec3 } from "gl-matrix";
import DeletedError from "../errors/DeletedError";
import BufferAttribute from "../renderer/BufferAttribute";
import Material from "../renderer/materials/Material";
import GLUtil from "../util/GLUtil";

export default class Mesh {
    private deleted: boolean = false;
    private material?: Material;

    private bufferAttribs: Record<string, BufferAttribute> = {};

    private position: vec3;
    private rotation: vec3;

    private vao: number;
    private vbo: number;

    private vertexCount: number;
    private transformDirty: boolean;

    private modelMatrix: mat4;

    public constructor() {
        const vaoPtr: Uint32Array = new Uint32Array(1);
        const vboPtr: Uint32Array = new Uint32Array(1);

        glGenVertexArrays(1, vaoPtr);
        glGenBuffers(1, vboPtr);

        this.position = vec3.create();
        this.rotation = vec3.create();

        this.vao = vaoPtr[0];
        this.vbo = vboPtr[0];

        this.vertexCount = 0;

        this.modelMatrix = mat4.create();

        this.transformDirty = true;
    }

    public setBufferAttrib(key: string, bufferAttrib: BufferAttribute): void {
        if (this.deleted) {
            throw new DeletedError();
        }

        this.bufferAttribs[key] = bufferAttrib;
    }

    public updateBuffers(): void {
        if (this.deleted) {
            throw new DeletedError();
        }

        const attribArray: BufferAttribute[] = Object.values(this.bufferAttribs)
            .sort((a, b) => a.getPosition() - b.getPosition());

        let bufferElementLength: number = 0;

        let offset: number = 0;
        let stride: number = 0;

        attribArray.forEach(attrib => {
            stride += attrib.getWidth();
            bufferElementLength += attrib.getBuffer().length;
        });

        const buffer = new Float32Array(bufferElementLength);

        attribArray.forEach(attrib => {
            const originalOffset = offset;
            const attribBuffer = attrib.getBuffer();
            const width = attrib.getWidth();

            for (let i = 0; i < this.vertexCount; offset += stride, i++) {
                const sliceStart = i * width;
                const sliceEnd = sliceStart + width;

                buffer.set(attribBuffer.slice(sliceStart, sliceEnd), offset);
            }

            offset = originalOffset + width;
        });

        glBindVertexArray(this.vao);

        glBindBuffer(GL_ARRAY_BUFFER, this.vbo);
        glBufferData(GL_ARRAY_BUFFER, buffer.byteLength, buffer, GL_STATIC_DRAW);

        let currentOffset: number = 0;

        for (const attrib of attribArray) {
            const width: number = attrib.getWidth();

            glVertexAttribPointer(attrib.getPosition(), width, GL_FLOAT, attrib.isNormalized(), stride * GLUtil.bufferAttribWidth(GL_FLOAT), currentOffset);
            glEnableVertexAttribArray(attrib.getPosition());

            currentOffset += width * GLUtil.bufferAttribWidth(GL_FLOAT);
        }

        glBindBuffer(GL_ARRAY_BUFFER, 0);
    }

    public setPosition(x: number, y: number = 0, z: number = 0): void {
        this.position[0] = x;
        this.position[1] = y;
        this.position[2] = z;

        this.transformDirty = true;
    }

    public setRotation(x: number, y: number = 0, z: number = 0): void {
        this.rotation[0] = x;
        this.rotation[1] = y;
        this.rotation[2] = z;

        this.transformDirty = true;
    }

    public rotate(x: number, y: number = 0, z: number = 0): void {
        const newRotation = vec3.create();

        newRotation[0] = x;
        newRotation[1] = y;
        newRotation[2] = z;

        vec3.add(this.rotation, this.rotation, newRotation);

        this.transformDirty = true;
    }

    public move(x: number, y: number = 0, z: number = 0): void {
        const newPosition = vec3.create();

        newPosition[0] = x;
        newPosition[1] = y;
        newPosition[2] = z;

        vec3.add(this.position, this.position, newPosition);

        this.transformDirty = true;
    }

    public isTransformDirty(): boolean {
        return this.transformDirty;
    }

    public setMaterial(material: Material): void {
        this.material = material;
    }

    public setVertexCount(count: number): void {
        this.vertexCount = count;
    }

    public getMaterial(): Material | undefined {
        return this.material;
    }

    public updateTransform(): void {
        this.modelMatrix = mat4.create();
        
        mat4.rotateX(this.modelMatrix, this.modelMatrix, this.rotation[0]);
        mat4.rotateY(this.modelMatrix, this.modelMatrix, this.rotation[1]);
        mat4.rotateZ(this.modelMatrix, this.modelMatrix, this.rotation[2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, this.position);

        this.transformDirty = false;
    }

    public getModelMatrix(): mat4 {
        return this.modelMatrix;
    }

    public draw(): void {
        if (typeof this.material !== "undefined") {
            this.material.use();

            glBindVertexArray(this.vao);
            glDrawArrays(GL_TRIANGLES, 0, this.vertexCount);
        } 
    }

    public cleanup(): void {
        glDeleteVertexArrays(1, new Uint32Array(this.vao));
        glDeleteBuffers(1, new Uint32Array(this.vbo));

        this.deleted = true;
    }
}