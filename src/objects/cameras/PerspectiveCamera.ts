import { mat4 } from "gl-matrix";
import MathUtil from "../../util/MathUtil";
import Camera from "./Camera";

export default class PerspectiveCamera extends Camera {
    private fov: number;
    private aspect: number;

    private far: number;
    private near: number;

    private frustum: mat4;

    constructor(fov: number = MathUtil.degreesToRad(70), near = 0.1, far = 1000) {
        super();

        this.fov = fov;
        this.aspect = 0;

        this.near = near;
        this.far = far;

        this.frustum = mat4.create();
    }

    protected updateProjectionMatrix(): void {
        mat4.perspective(this.projectionMatrix, this.fov, this.aspect, this.near, this.far);
    }

    /**
     * @param ratio the new aspect ratio
     */
    public setAspectRatio(ratio: number): PerspectiveCamera {
        this.aspect = ratio;
        this.projectionDirty = true;

        return this;
    }

    /**
     * @param fov new fov
     */
    public setFov(fov: number): PerspectiveCamera {
        this.fov = fov;
        this.projectionDirty = true;

        return this;
    }

    /**
     * @param far far clipping plane
     */
    public setFar(far: number): PerspectiveCamera {
        this.far = far;
        this.projectionDirty = true;

        return this;
    }

    /**
     * @param near near clipping plane
     */
    public setNear(near: number): PerspectiveCamera {
        this.near = near;
        this.projectionDirty = true;

        return this;
    }
}