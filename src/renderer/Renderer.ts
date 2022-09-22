import { glClear, glClearColor, GL_COLOR_BUFFER_BIT, GL_DEPTH_BUFFER_BIT } from "@minecraftts/opengl";
import Camera from "../objects/cameras/Camera";
import Scene from "../objects/Scene";

export default class Renderer {
    constructor() {

    }

    public draw(scene: Scene, camera: Camera) {
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

        if (camera.isDirty()) {
            camera.update();
        }

        scene.getElements().forEach(mesh => {
            const material = mesh.getMaterial();

            if (typeof material !== "undefined") {
                if (mesh.isTransformDirty()) {
                    mesh.updateTransform();
                }

                if (material.hasAllUniforms([ "view_matrix", "model_matrix", "projection_matrix" ])) {
                    material.setUniform("view_matrix", camera.getViewMatrix());
                    material.setUniform("model_matrix", mesh.getModelMatrix());
                    material.setUniform("projection_matrix", camera.getProjectionMatrix());
                }

                mesh.draw();
            }
        })
    }

    public setClearColor(r: number, g: number, b: number) {
        glClearColor(r, g, b, 1);   
    }
}