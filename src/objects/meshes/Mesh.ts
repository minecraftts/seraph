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
import GLUtil from "../../util/GLUtil";
import DrawType from "./DrawType";
import MeshEvents from "./MeshEvents";
import MeshType from "./MeshType";

/**
 * Base mesh class
 */
export default class Mesh extends (EventEmitter as new () => TypedEventEmitter<MeshEvents>){
    private deleted: boolean = false;
    private material?: Material;

    private bufferAttribs: Record<string, BufferAttribute> = {};

    private position: vec3;
    private rotation: vec3;

    private vao: number;
    private vbo: number;
    private ebo: number;

    private vertexCount: number;
    private transformDirty: boolean;

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

        glBindVertexArray(this.vao);

        glBindBuffer(GL_ARRAY_BUFFER, this.vbo);
        glBufferData(GL_ARRAY_BUFFER, buffer.byteLength, buffer, this.drawType);

        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, this.ebo);
        glBufferData(GL_ELEMENT_ARRAY_BUFFER, this.indices.byteLength, this.indices, this.drawType);

        let currentOffset: number = 0;

        for (const attrib of attribArray) {
            const width: number = attrib.getWidth();

            glVertexAttribPointer(attrib.getPosition(), width, GL_FLOAT, attrib.isNormalized(), stride * GLUtil.bufferAttribWidth(GL_FLOAT), currentOffset);
            glEnableVertexAttribArray(attrib.getPosition());

            currentOffset += width * GLUtil.bufferAttribWidth(GL_FLOAT);
        }

        glBindBuffer(GL_ARRAY_BUFFER, 0);
    }

    /**
     * @param x mesh x coord
     * @param y mesh y coord
     * @param z mesh z coord
     */
    public setPosition(x: number, y: number = 0, z: number = 0): void {
        this.position[0] = x;
        this.position[1] = y;
        this.position[2] = z;

        this.transformDirty = true;
    }

    /**
     * @param x rotation x axis 
     * @param y rotation y axis
     * @param z rotation z axis
     */
    public setRotation(x: number, y: number = 0, z: number = 0): void {
        this.rotation[0] = x;
        this.rotation[1] = y;
        this.rotation[2] = z;

        this.transformDirty = true;
    }

    /**
     * @param x x axis to rotate by
     * @param y y axis to rotate by
     * @param z z axis to rotate by
     */
    public rotate(x: number, y: number = 0, z: number = 0): void {
        const newRotation = vec3.create();

        newRotation[0] = x;
        newRotation[1] = y;
        newRotation[2] = z;

        vec3.add(this.rotation, this.rotation, newRotation);

        this.transformDirty = true;
    }

    /**
     * @param x x coord to move mesh by
     * @param y y coord to move mesh by
     * @param z z coord to move mesh by
     */
    public move(x: number, y: number = 0, z: number = 0): void {
        const newPosition = vec3.create();

        newPosition[0] = x;
        newPosition[1] = y;
        newPosition[2] = z;

        vec3.add(this.position, this.position, newPosition);

        this.transformDirty = true;
    }

    /**
     * @returns `true` if the transformation matrix needs to be updated, `false` otherwise
     */
    public isTransformDirty(): boolean {
        return this.transformDirty;
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

            glBindVertexArray(this.vao);

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