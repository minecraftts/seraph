import { mat4, vec3 } from "gl-matrix";
import NotImplementedError from "../../errors/NotImplementedError";

export default class Camera {
    protected position: vec3;
    protected rotation: vec3;
    protected rotationPoint: vec3;

    protected viewMatrix: mat4;
    protected projectionMatrix: mat4;

    protected viewDirty: boolean;
    protected projectionDirty: boolean;

    constructor() {
        this.projectionMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.position = vec3.create();
        this.rotation = vec3.create();
        this.rotationPoint = vec3.create();

        this.viewDirty = true;
        this.projectionDirty = true;
    }

    public setPosition(x: number, y: number, z: number): void {
        this.position[0] = x;
        this.position[1] = y;
        this.position[2] = z;

        this.viewDirty = true;
    }

    public rotate(x: number, y: number = 0, z: number = 0): void {
        const newRotation = vec3.create();

        newRotation[0] = x;
        newRotation[1] = y;
        newRotation[2] = z;

        vec3.add(this.rotation, this.rotation, newRotation);

        this.viewDirty = true;
    }

    protected updateProjectionMatrix(): void {
        throw new NotImplementedError("Camera.updateProjectionMatrix");
    }

    protected updateViewMatrix(): void {
        this.viewMatrix = mat4.create();

        let rotateAroundPoint: boolean = this.rotationPoint[0] !== 0 || this.rotationPoint[1] !== 0 || this.rotationPoint[2] !== 0;

        if (rotateAroundPoint) {
            mat4.translate(this.viewMatrix, this.viewMatrix, this.rotationPoint);
        }

        mat4.rotateX(this.viewMatrix, this.viewMatrix, this.rotation[0]);
        mat4.rotateY(this.viewMatrix, this.viewMatrix, this.rotation[1]);
        mat4.rotateZ(this.viewMatrix, this.viewMatrix, this.rotation[2]);

        if (rotateAroundPoint) {
            mat4.translate(this.viewMatrix, this.viewMatrix, vec3.inverse(vec3.create(), this.rotationPoint));
        }
        
        mat4.translate(this.viewMatrix, this.viewMatrix, this.position);
    }

    public getProjectionMatrix(): mat4 {
        return this.projectionMatrix;
    }

    public getViewMatrix(): mat4 {
        return this.viewMatrix;
    }

    public isDirty(): boolean {
        return this.viewDirty || this.projectionDirty;
    }

    public isViewDirty(): boolean {
        return this.viewDirty;
    }

    public isProjectionDirty(): boolean {
        return this.projectionDirty;
    }

    public update(): void {
        if (this.viewDirty) this.updateViewMatrix();
        if (this.projectionDirty && this instanceof Camera) this.updateProjectionMatrix();

        this.viewDirty = false;
        this.projectionDirty = false;
    }
}