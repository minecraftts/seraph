import { glClear, glClearColor, GL_COLOR_BUFFER_BIT, GL_DEPTH_BUFFER_BIT, GL_TEXTURE_2D } from "@minecraftts/opengl";
import Camera from "../objects/cameras/Camera";
import Scene from "../objects/Scene";
import StateManager from "../StateManager";

export default class Renderer {
    constructor() {

    }

    /**
     * @param scene the scene to draw
     * @param camera an optional camera to draw the scene from
     * @param clear
     */
    public draw(scene: Scene, camera?: Camera, clear: boolean = true) {
        if (clear) {
            glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
        }

        if (camera && camera.isDirty()) {
            camera.update();
        }

        scene.getElements().forEach(mesh => {
            const material = mesh.getMaterial();

            if (typeof material !== "undefined") {
                if (mesh.isTransformDirty()) {
                    mesh.updateTransform();
                }

                material.bindTextures();

                if (material.hasUniform("tex_bound")) {
                    material.setUniform("tex_bound", typeof StateManager.getCurrentTexture(GL_TEXTURE_2D) !== "undefined" ? 1 : 0);
                }

                if (camera && material.hasAllUniforms([ "view_matrix", "model_matrix", "projection_matrix" ])) {
                    material.setUniform("view_matrix", camera.getViewMatrix());
                    material.setUniform("model_matrix", mesh.getModelMatrix());
                    material.setUniform("projection_matrix", camera.getProjectionMatrix());
                }

                mesh.draw();
            }
        })
    }

    /**
     * @param r red value from `0` to `1`
     * @param g green value from `0` to `1`
     * @param b blue value from `0` to `1`
     */
    public setClearColor(r: number, g: number, b: number) {
        glClearColor(r, g, b, 1);   
    }
}