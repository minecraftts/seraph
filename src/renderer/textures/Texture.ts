import { BufferedImage } from "@minecraftts/buffered-image";
import { glGenTextures, glTexImage2D, glTexParameteri, GL_NEAREST, GL_REPEAT, GL_RGBA, GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_TEXTURE_MIN_FILTER, GL_TEXTURE_WRAP_S, GL_TEXTURE_WRAP_T, GL_UNSIGNED_BYTE } from "@minecraftts/opengl";
import StateManager from "../../StateManager";

export default class Texture {
    private texture: number;

    private width: number;
    private height: number;

    constructor(image: BufferedImage) {
        const texturePtr: Uint32Array = new Uint32Array(1);

        glGenTextures(1, texturePtr);

        this.texture = texturePtr[0];

        this.width = 0;
        this.height = 0;

        this.setImage(image);
    }

    /**
     * Binds the texture
     */
    public use(): void {
        StateManager.bindTexture(GL_TEXTURE_2D, this.texture);
    }

    /**
     * Sets the texture's data
     * @param image a `BufferedImage` containing the texture's data
     */
    public setImage(image: BufferedImage): void {
        const previousTexture = StateManager.getCurrentTexture(GL_TEXTURE_2D);
        const data = image.getData();

        StateManager.bindTexture(GL_TEXTURE_2D, this.texture);

        StateManager.setTextureParameter(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
        StateManager.setTextureParameter(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
        StateManager.setTextureParameter(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
        StateManager.setTextureParameter(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);

        glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, image.getWidth(), image.getHeight(), 0, GL_RGBA, GL_UNSIGNED_BYTE, data);

        this.width = image.getWidth();
        this.height = image.getHeight();

        if (previousTexture && previousTexture != this.texture) {
            StateManager.bindTexture(GL_TEXTURE_2D, previousTexture);
        }
    }

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    public getInternal(): number {
        return this.texture;
    }
}