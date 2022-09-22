import { mat4 } from "gl-matrix";
import MathUtil from "../../util/MathUtil";
import Camera from "./Camera";

export default class PerspectiveCamera extends Camera {
    private fov: number;
    private aspect: number;

    private far: number;
    private near: number;

    private frustum: mat4;

    constructor() {
        super();

        this.fov = MathUtil.degreesToRad(70);
        this.aspect = 0;
        this.far = 1000;
        this.near = 0.1;
        this.frustum = mat4.create();
    }

    protected updateProjectionMatrix(): void {
        mat4.perspective(this.projectionMatrix, this.fov, this.aspect, this.near, this.far);
    }

    public setAspectRatio(ratio: number): void {
        this.aspect = ratio;
        this.projectionDirty = true;
    }
}