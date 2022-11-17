import { mat4, vec3 } from "gl-matrix";
import Object3D from "../Object3D";

export default abstract class Camera extends Object3D {
    protected position: vec3;
    protected rotation: vec3;
    protected rotationPoint: vec3;

    protected viewMatrix: mat4;
    protected projectionMatrix: mat4;

    protected projectionDirty: boolean;

    protected constructor() {
        super();

        this.projectionMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.position = vec3.create();
        this.rotation = vec3.create();
        this.rotationPoint = vec3.create();

        this.projectionDirty = true;
    }

    protected abstract updateProjectionMatrix(): void;

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

    /**
     * @returns the camera's projection matrix
     */
    public getProjectionMatrix(): mat4 {
        return this.projectionMatrix;
    }

    /**
     * @returns the camera's view matrix
     */
    public getViewMatrix(): mat4 {
        return this.viewMatrix;
    }

    /**
     * @returns `true` if the view matrix or projection matrix needs to be updated, `false` otherwise 
     */
    public isDirty(): boolean {
        return this.transformDirty || this.projectionDirty;
    }

    /**
     * @returns `true` if the view matrix needs to be updated, `false` otherwise
     */
    public isViewDirty(): boolean {
        return this.isTransformDirty();
    }

    /**
     * @returns `true` if the projection matrix needs to be updated, `false` otherwise 
     */
    public isProjectionDirty(): boolean {
        return this.projectionDirty;
    }

    /**
     * Updates the view and or projection matrix if they need to be updated.
     */
    public update(): void {
        if (this.transformDirty) this.updateViewMatrix();
        if (this.projectionDirty && this instanceof Camera) this.updateProjectionMatrix();

        this.transformDirty = false;
        this.projectionDirty = false;
    }
}