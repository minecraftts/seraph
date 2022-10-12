import { glClear, glClearColor, GL_COLOR_BUFFER_BIT, GL_DEPTH_BUFFER_BIT } from "@minecraftts/opengl";
import Camera from "../objects/cameras/Camera";
import Scene from "../objects/Scene";

export default class Renderer {
    constructor() {

    }

    /**
     * @param scene the scene to draw
     * @param camera an optional camera to draw the scene from
     */
    public draw(scene: Scene, camera?: Camera) {
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

        if (camera && camera.isDirty()) {
            camera.update();
        }

        scene.getElements().forEach(mesh => {
            const material = mesh.getMaterial();

            if (typeof material !== "undefined") {
                if (mesh.isTransformDirty()) {
                    mesh.updateTransform();
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