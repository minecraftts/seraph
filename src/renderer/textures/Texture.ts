import { BufferedImage } from "@minecraftts/buffered-image";
import { glGenTextures, glTexImage2D, glTexParameteri, GL_NEAREST, GL_REPEAT, GL_RGBA, GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_TEXTURE_MIN_FILTER, GL_TEXTURE_WRAP_S, GL_TEXTURE_WRAP_T, GL_UNSIGNED_BYTE, glDeleteTextures } from "@minecraftts/opengl";
import DeletedError from "../../errors/DeletedError";
import StateManager from "../../StateManager";
import IDeletable from "../../util/IDeletable";

export default class Texture implements IDeletable {
    private readonly texture: number;

    private width: number;
    private height: number;

    public deleted: boolean = false;

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
        if (this.deleted) {
            throw new DeletedError();
        }

        StateManager.bindTexture(GL_TEXTURE_2D, this.texture);
    }

    /**
     * Sets the texture's data
     * @param image a `BufferedImage` containing the texture's data
     */
    public setImage(image: BufferedImage): void {
        if (this.deleted) {
            throw new DeletedError();
        }

        const previousTexture = StateManager.getCurrentTexture(GL_TEXTURE_2D);
        const data = image.getData();

        StateManager.bindTexture(GL_TEXTURE_2D, this.texture);

        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);	
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);

        glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, image.getWidth(), image.getHeight(), 0, GL_RGBA, GL_UNSIGNED_BYTE, data);

        this.width = image.getWidth();
        this.height = image.getHeight();

        if (previousTexture && previousTexture != this.texture) {
            StateManager.bindTexture(GL_TEXTURE_2D, previousTexture);
        }
    }

    public getWidth(): number {
        if (this.deleted) {
            throw new DeletedError();
        }

        return this.width;
    }

    public getHeight(): number {
        if (this.deleted) {
            throw new DeletedError();
        }

        return this.height;
    }

    public getInternal(): number {
        if (this.deleted) {
            throw new DeletedError();
        }

        return this.texture;
    }

    public delete(): void {
        if (this.deleted) {
            throw new DeletedError();
        }

        glDeleteTextures(1, new Uint32Array([ this.texture ]));
        StateManager.bindTexture(GL_TEXTURE_2D, 0);

        this.deleted = true;
    }
}