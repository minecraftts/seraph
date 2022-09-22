import Material from "./Material";
import path from "path";
import Constants from "../../Constants";

type Uniforms = {
    view_matrix: "mat4x4",
    model_matrix: "mat4x4",
    projection_matrix: "mat4x4"
}

export default class UnlitMaterial extends Material<Uniforms> {
    constructor() {
        super({
            vertexPath: path.join(Constants.SERAPH_SHADER_DIR, "unlit.vsh"),
            fragmentPath: path.join(Constants.SERAPH_SHADER_DIR, "unlit.fsh")
        });

        this.registerUniform("view_matrix", "mat4x4");
        this.registerUniform("model_matrix", "mat4x4");
        this.registerUniform("projection_matrix", "mat4x4");
    }
}