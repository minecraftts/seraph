import Material from "./Material";
import Constants from "../../Constants";

import path from "path";
import Subset from "../../util/Subset";

type Uniforms = {
    tex_bound: "int",
    view_matrix: "mat4x4",
    model_matrix: "mat4x4",
    projection_matrix: "mat4x4",
    color: "vec4"
};

type Options = {
    color: {
        r: number,
        g: number,
        b: number,
        a: number
    }
};

/**
 * Simple unlit material
 */
export default class UnlitMaterial extends Material<Uniforms, Options> {
    private readonly color: Float32Array;

    constructor(options: Subset<Options> = {}) {
        super({
            vertexPath: path.join(Constants.SERAPH_SHADER_DIR, "unlit.vsh"),
            fragmentPath: path.join(Constants.SERAPH_SHADER_DIR, "unlit.fsh"),
            ...options
        }, {
            color: {
                r: 1,
                g: 1,
                b: 1,
                a: 1
            }
        });

        this.color = new Float32Array(4);

        this.color[0] = this.options.color.r;
        this.color[1] = this.options.color.g;
        this.color[2] = this.options.color.b;
        this.color[3] = this.options.color.a;

        this.registerUniform("tex_bound", "int");
        this.registerUniform("view_matrix", "mat4x4");
        this.registerUniform("model_matrix", "mat4x4");
        this.registerUniform("projection_matrix", "mat4x4");
        this.registerUniform("color", "vec4");
    }

    public setColor(r: number = 0, b: number = 0, g: number = 0, a: number = 1) {
        this.color[0] = r;
        this.color[1] = g;
        this.color[2] = b;
        this.color[3] = a;
    }

    public use() {
        super.use();

        this.setUniform("color", this.color);
    }
}