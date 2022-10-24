import { CanvasRenderingContext2D } from "canvas";
import { BufferedImage } from "@minecraftts/buffered-image";
import Constants from "./Constants";
import Display from "./Display";
import Screen from "./objects/meshes/Screen";
import Scene from "./objects/Scene";
import Material from "./renderer/materials/Material";
import Renderer from "./renderer/Renderer";
import path from "path";
import Texture from "./renderer/textures/Texture";

/**
 * Canvas window
 */
export default class CanvasDisplay extends Display {
    private texture: Texture;
    private image: BufferedImage;
    private scene: Scene;
    private renderer: Renderer;
    private screen: Screen;
    private material: Material;

    constructor(width?: number, height?: number, title: string = "Seraph Canvas") {
        super(width, height, title);

        this.image = new BufferedImage(this.getWidth(), this.getHeight());
        this.renderer = new Renderer();

        this.scene = new Scene();
        this.screen = new Screen();

        this.material = new Material({
            vertexPath: path.join(Constants.SERAPH_SHADER_DIR, "screen.vsh"),
            fragmentPath: path.join(Constants.SERAPH_SHADER_DIR, "screen.fsh")
        });

        this.screen.setMaterial(this.material);
        this.scene.add(this.screen);

        this.texture = new Texture(this.image);
        this.material.setTexture(this.texture);

        this.attachHandlers();
    }

    private attachHandlers(): void {
        this.on("resize", (width, height, ratio) => {
            this.image = new BufferedImage(width, height);
        });
    }

    /**
     * Draws the canvas contents to screen and swaps back and front buffers.
     */
    public swapBuffers(): void {
        this.texture.setImage(this.image);
        this.renderer.draw(this.scene);

        super.swapBuffers();
    }

    /**
     * @returns the canvas rendering context
     */
    public getGraphics(): CanvasRenderingContext2D {
        return this.image.getGraphics();
    }
}