import {
    GL_ARRAY_BUFFER, GL_ELEMENT_ARRAY_BUFFER,
    GL_FLOAT,
    GL_TRIANGLES, GL_UNSIGNED_INT,
    glBindBuffer,
    glBindVertexArray,
    glBufferData,
    glDeleteBuffers,
    glDeleteVertexArrays,
    glDrawArrays, glDrawElements,
    glEnableVertexAttribArray,
    glGenBuffers,
    glGenVertexArrays,
    glVertexAttribPointer
} from "@minecraftts/opengl";
import EventEmitter from "events";
import {mat4, vec3} from "gl-matrix";
import TypedEventEmitter from "typed-emitter";
import DeletedError from "../../errors/DeletedError";
import BufferAttribute from "../../renderer/BufferAttribute";
import Material from "../../renderer/materials/Material";
import StateManager from "../../StateManager";
import GLUtil from "../../util/GLUtil";
import Object3D from "../Object3D";
import DrawType from "./DrawType";
import MeshEvents from "./MeshEvents";
import MeshType from "./MeshType";

/**
 * Base mesh class
 */
export default class Mesh extends Object3D<MeshEvents> {
    private deleted: boolean = false;
    private material?: Material;

    private bufferAttribs: Record<string, BufferAttribute> = {};

    private vao: number;
    private vbo: number;
    private ebo: number;

    private vertexCount: number;

    private modelMatrix: mat4;

    private drawType: DrawType;
    private meshType: MeshType;

    private indices: Uint32Array;

    public constructor() {
        super();

        const vaoPtr: Uint32Array = new Uint32Array(1);
        const bufPtr: Uint32Array = new Uint32Array(2);

        glGenVertexArrays(1, vaoPtr);
        glGenBuffers(2, bufPtr);

        this.position = vec3.create();
        this.rotation = vec3.create();

        this.vao = vaoPtr[0];

        this.vbo = bufPtr[0];
        this.ebo = bufPtr[1];

        this.vertexCount = 0;

        this.modelMatrix = mat4.create();

        this.transformDirty = true;

        this.drawType = DrawType.STATIC;
        this.meshType = MeshType.TRIANGLES;

        this.indices = new Uint32Array(0);
    }

    /**
     * @param key attribute key
     * @param bufferAttrib attribute to set `key` to
     */
    public setBufferAttrib(key: string, bufferAttrib: BufferAttribute): void {
        if (this.deleted) {
            throw new DeletedError();
        }

        this.bufferAttribs[key] = bufferAttrib;
    }

    /**
     * Recreates the mesh's buffer, must be called after updating any buffer attributes
     */
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

        StateManager.bindVertexArray(this.vao);

        StateManager.bindBuffer(GL_ARRAY_BUFFER, this.vbo);
        glBufferData(GL_ARRAY_BUFFER, buffer.byteLength, buffer, this.drawType);

        StateManager.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, this.ebo);
        glBufferData(GL_ELEMENT_ARRAY_BUFFER, this.indices.byteLength, this.indices, this.drawType);

        let currentOffset: number = 0;

        for (const attrib of attribArray) {
            const width: number = attrib.getWidth();

            StateManager.setVertexAttribPointer(attrib.getPosition(), width, GL_FLOAT, attrib.isNormalized(), stride * GLUtil.bufferAttribWidth(GL_FLOAT), currentOffset);
            StateManager.enableVertexAttrib(attrib.getPosition());

            currentOffset += width * GLUtil.bufferAttribWidth(GL_FLOAT);
        }

        StateManager.bindBuffer(GL_ARRAY_BUFFER, 0);
    }

    /**
     * @param material the material this mesh should use 
     */
    public setMaterial(material: Material): void {
        this.material = material;
    }

    /**
     * Sets number of unique vertices in the mesh, not the number of indices.
     * @param count the number of vertices this mesh has
     */
    public setVertexCount(count: number): void {
        this.vertexCount = count;
    }

    /**
     * @returns the material currently being used by this mesh 
     */
    public getMaterial(): Material | undefined {
        return this.material;
    }

    /**
     * Updates the mesh's transformation matrix
     */
    public updateTransform(): void {
        this.modelMatrix = mat4.create();
        
        mat4.rotateX(this.modelMatrix, this.modelMatrix, this.rotation[0]);
        mat4.rotateY(this.modelMatrix, this.modelMatrix, this.rotation[1]);
        mat4.rotateZ(this.modelMatrix, this.modelMatrix, this.rotation[2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, this.position);

        this.transformDirty = false;
    }

    /**
     * @returns the mesh's model matrix
     */
    public getModelMatrix(): mat4 {
        return this.modelMatrix;
    }

    /**
     * Bind the material and draw the mesh's geometry
     */
    public draw(): void {
        if (typeof this.material !== "undefined") {
            this.material.use();

            this.emit("pre_draw");

            StateManager.bindVertexArray(this.vao);

            if (this.indices.length > 0) {
                glDrawElements(this.meshType, this.indices.length, GL_UNSIGNED_INT, 0);
            } else {
                glDrawArrays(this.meshType, 0, this.vertexCount);
            }

            this.emit("post_draw");
        } 
    }

    /**
     *
     * @param indices {Uint32Array}
     * @returns {void}
     */
    public setIndices(indices: Uint32Array) {
        this.indices = indices;
    }

    /**
     * Sets the specified draw type and updates buffers
     * @param type {DrawType} specified draw type
     * @returns {void}
     */
    public setDrawType(type: DrawType): void {
        this.drawType = type;
        this.updateBuffers();
    }

    /**
     * Sets the specified mesh type
     * @param type {MeshType}
     * @returns {void}
     */
    public setMeshType(type: MeshType): void {
        this.meshType = type;
    }

    /**
     * Free any resources used by this mesh
     */
    public cleanup(): void {
        glDeleteVertexArrays(1, new Uint32Array(this.vao));
        glDeleteBuffers(1, new Uint32Array(this.vbo));

        this.deleted = true;
    }
}