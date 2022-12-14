import {
    GL_COLOR_ATTACHMENT0,
    GL_DEPTH24_STENCIL8,
    GL_DEPTH_STENCIL_ATTACHMENT,
    GL_FRAMEBUFFER,
    GL_FRAMEBUFFER_COMPLETE,
    GL_LINEAR,
    GL_RENDERBUFFER,
    GL_RGB,
    GL_TEXTURE_2D,
    GL_TEXTURE_MAG_FILTER,
    GL_TEXTURE_MIN_FILTER,
    GL_UNSIGNED_BYTE,
    glBindFramebuffer,
    glBindRenderbuffer,
    glBindTexture,
    glCheckFramebufferStatus,
    glDeleteFramebuffers, glDeleteRenderbuffers,
    glDeleteTextures,
    glFramebufferRenderbuffer,
    glFramebufferTexture2D,
    glGenFramebuffers,
    glGenRenderbuffers,
    glGenTextures,
    glRenderbufferStorage,
    glTexImage2D,
    glTexParameteri
} from "@minecraftts/opengl";
import Display from "../Display";
import DeletedError from "../errors/DeletedError";
import StateManager from "../StateManager";
import IDeletable from "../util/IDeletable";

export default class Framebuffer implements IDeletable {
    private texture: number;

    private fbo: number;
    private rbo: number;

    private readonly display: Display | null;

    private width: number;
    private height: number;

    public deleted: boolean = false;

    constructor(display: Display);
    constructor(width: number, height: number);
    constructor(displayOrWidth: number | Display, height?: number) {
        if (typeof displayOrWidth === "number") {
            this.width = displayOrWidth;
            this.height = height ?? 0;
            this.display = null;

            if (!height) {
                throw new Error("Missing required parameter.");
            }
        } else {
            this.width = displayOrWidth.getWidth();
            this.height = displayOrWidth.getHeight();

            this.display = displayOrWidth;
        }

        this.texture = -1;
        this.fbo = -1;
        this.rbo = -1;

        this.createObjects();

        if (this.display) {
            this.display.on("resize", (width, height) => {
                this.width = width;
                this.height = height;

                this.recreate();
            });
        }
    }

    private createObjects(): void {
        const fboPtr = new Uint32Array(1);

        glGenFramebuffers(1, fboPtr);

        this.fbo = fboPtr[0];

        glBindFramebuffer(GL_FRAMEBUFFER, this.fbo);

        const texturePtr = new Uint32Array(1);

        glGenTextures(1, texturePtr);

        this.texture = texturePtr[0];

        glBindTexture(GL_TEXTURE_2D, this.texture);
        glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, this.width, this.height, 0, GL_RGB, GL_UNSIGNED_BYTE, new Uint8Array(0));
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
        glBindTexture(GL_TEXTURE_2D, 0);

        glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, this.texture, 0);

        const rboPtr = new Uint32Array(1);

        glGenRenderbuffers(1, rboPtr);

        this.rbo = rboPtr[0];

        glBindRenderbuffer(GL_RENDERBUFFER, this.rbo);
        glRenderbufferStorage(GL_RENDERBUFFER, GL_DEPTH24_STENCIL8, this.width, this.height);
        glBindRenderbuffer(GL_RENDERBUFFER, 0);

        glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_STENCIL_ATTACHMENT, GL_RENDERBUFFER, this.rbo);

        if (glCheckFramebufferStatus(GL_FRAMEBUFFER) !== GL_FRAMEBUFFER_COMPLETE) {
            throw new Error("failed to create framebuffer");
        }

        glBindFramebuffer(GL_FRAMEBUFFER, 0);
    }

    public recreate(): void {
        if (this.deleted) {
            throw new DeletedError();
        }

        if (this.texture !== -1) glDeleteTextures(1, new Uint32Array([ this.texture ]));
        if (this.fbo !== -1) glDeleteFramebuffers(1, new Uint32Array([ this.fbo ]));
        if (this.rbo !== -1) glDeleteRenderbuffers(1, new Uint32Array([ this.rbo ]));

        this.createObjects();
    }

    public delete(): void {
        if (this.deleted) {
            throw new DeletedError();
        }

        if (this.texture !== -1) glDeleteTextures(1, new Uint32Array([this.texture]));
        if (this.fbo !== -1) glDeleteFramebuffers(1, new Uint32Array([this.fbo]));
        if (this.rbo !== -1) glDeleteRenderbuffers(1, new Uint32Array([this.rbo]));

        Framebuffer.unbind();
        StateManager.bindTexture(GL_TEXTURE_2D, 0);

        this.deleted = true;
    }

    public bind(): void {
        if (this.deleted) {
            throw new DeletedError();
        }

        if (this.fbo !== -1) {
            glBindFramebuffer(GL_FRAMEBUFFER, this.fbo);
        }
    }

    public bindTexture(): void {
        if (this.deleted) {
            throw new DeletedError();
        }

        if (this.texture !== -1) {
            glBindTexture(GL_TEXTURE_2D, this.texture);
        }
    }

    public static unbind(): void {
        StateManager.unbindFramebuffer();
    }
}