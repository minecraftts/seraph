import { BufferedImage } from "@minecraftts/buffered-image";
import { glGenTextures, glTexImage2D, glTexParameteri, GL_LINEAR, GL_NEAREST, GL_REPEAT, GL_RGBA, GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_TEXTURE_MIN_FILTER, GL_TEXTURE_WRAP_S, GL_TEXTURE_WRAP_T, GL_UNSIGNED_BYTE } from "@minecraftts/opengl";
import StateManager from "../../StateManager";

export default class Texture {
    private texture: number;

    constructor(image: BufferedImage) {
        const texturePtr: Uint32Array = new Uint32Array(1);

        glGenTextures(1, texturePtr);

        this.texture = texturePtr[0];
        this.setImage(image);
    }

    public use(): void {
        StateManager.bindTexture(GL_TEXTURE_2D, this.texture);
    }

    public setImage(image: BufferedImage): void {
        const previousTexture = StateManager.getCurrentTexture(GL_TEXTURE_2D);
        const data = image.getData();

        StateManager.bindTexture(GL_TEXTURE_2D, this.texture);

        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);	
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);

        glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, image.getWidth(), image.getHeight(), 0, GL_RGBA, GL_UNSIGNED_BYTE, data);

        if (previousTexture && previousTexture != this.texture) {
            StateManager.bindTexture(GL_TEXTURE_2D, previousTexture);
        }
    }
}