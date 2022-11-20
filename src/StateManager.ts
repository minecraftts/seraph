import { glfwSwapInterval } from "@minecraftts/glfw";
import {
    GL_FRAMEBUFFER,
    GL_MAX_TEXTURE_IMAGE_UNITS,
    GL_MAX_TEXTURE_UNITS,
    GL_TEXTURE0,
    glActiveTexture, glBindBuffer,
    glBindFramebuffer,
    glBindTexture,
    glBindVertexArray,
    glCullFace,
    glDepthMask,
    glDisable,
    glEnable, glEnableVertexAttribArray,
    glFrontFace,
    glGetIntegerv,
    glTexParameteri,
    glUseProgram, glVertexAttribPointer
} from "@minecraftts/opengl";

/**
 * General utility class to manage the OpenGL state
 */
export default class StateManager {
    private static currentProgram: number = -1;
    private static currentFramebuffer: number = -1;
    private static currentTextureUnit: number = 0;

    private static currentTextures: Record<number, Record<number, number>> = {};
    private static textureParameters: Record<number, Record<number, number>> = {}

    private static enabledCapabilities: number[] = [];

    private static depthMask: boolean;

    private static cullFace: number = -1;
    private static faceDirection: number = -1;

    private static vertexArray: number = -1;
    private static vertexAttribPointers: Record<number, Record<number, {
        size: number,
        type: number,
        normalized: boolean,
        stride: number,
        offset: number
    }>> = {};
    private static enabledVertexAttribs: Record<number, number[]> = {};

    private static currentBuffers: Record<number, number> = {};

    private static vsync: boolean;

    /**
     * Switches to specified program unless it's already active.
     * @param program an opengl program
     */
    public static useProgram(program: number): void {
        if (this.currentProgram === program) {
            return;
        }

        glUseProgram(program);

        this.currentProgram = program;
    }

    /**
     * Returns current active program
     */
    public static getProgram(): number {
        return this.currentProgram;
    }

    /**
     * Binds the current texture unless it is already in use
     * @param target the target to bind to. only `GL_TEXTURE2D` is currently supported
     * @param texture an opengl texture
     */
    public static bindTexture(target: number, texture: number): void {
        if (this.currentTextures[this.currentTextureUnit][target] === texture) {
            return;
        }

        glBindTexture(target, texture);
        
        this.currentTextures[this.currentTextureUnit][target] = texture;
    }

    public static setTextureParameter(target: number, parameter: number, value: number): void {
        const currentTexture = this.currentTextures[this.currentTextureUnit][target] ?? -1;

        if (currentTexture !== -1) {
            if (typeof this.textureParameters[currentTexture] === "undefined") {
                this.textureParameters[currentTexture] = {};
            }

            if (this.textureParameters[currentTexture][parameter] !== value) {
                this.textureParameters[currentTexture][parameter] = value;
                glTexParameteri(target, parameter, value);
            }
        }
    }

    /**
     * Sets vsync on/off for all windows
     * @param state a boolean indicating whether vsync should be on or off
     */
    public static setVsync(state: boolean): void {
        if (this.vsync !== state) {
            this.vsync = state;
            glfwSwapInterval(this.vsync ? 1 : 0);
        }
    }

    /**
     * Gets the bound texture for the target.
     * @param target the target to query
     * @returns the currently bound opengl texture for the target or undefined if none is bound
     */
    public static getCurrentTexture(target: number): number | undefined {
        return this.currentTextures[this.currentTextureUnit][target];
    }

    public static setTextureUnit(unit: number): void {
        if (this.currentTextureUnit !== unit) {
            this.currentTextureUnit = unit;

            glActiveTexture(GL_TEXTURE0 + unit);
        }
    }

    public static bindFramebuffer(fbo: number): void {
        if (this.currentFramebuffer !== fbo) {
            this.currentFramebuffer = fbo;
            glBindFramebuffer(GL_FRAMEBUFFER, fbo);
        }
    }

    public static unbindFramebuffer(): void {
        glBindFramebuffer(GL_FRAMEBUFFER, 0);
    }

    public static enable(capability: number): void {
        if (!this.enabledCapabilities.includes(capability)) {
            glEnable(capability);
            this.enabledCapabilities.push(capability);
        }
    }

    public static disable(capability: number): void {
        const index = this.enabledCapabilities.indexOf(capability);

        if (index !== -1) {
            glDisable(capability);
            this.enabledCapabilities.splice(index, 1);
        }
    }

    public static setDepthMask(flag: boolean): void {
        if (flag !== this.depthMask) {
            glDepthMask(flag);
            this.depthMask = flag;
        }
    }

    public static setCullFace(face: number): void {
        if (face !== this.cullFace) {
            this.cullFace = face;
            glCullFace(face);
        }
    }

    public static setFaceDirection(dir: number): void {
        if (dir !== this.faceDirection) {
            this.faceDirection = dir;
            glFrontFace(dir);
        }
    }

    public static bindVertexArray(array: number): void {
        if (array !== this.vertexArray) {
            this.vertexArray = array;
            glBindVertexArray(array);
        }
    }

    public static setVertexAttribPointer(index: number, size: number, type: number, normalized: boolean, stride: number, offset: number): void {
        if (this.vertexArray !== -1) {
            if (typeof this.vertexAttribPointers[this.vertexArray] === "undefined") {
                this.vertexAttribPointers[this.vertexArray] = {
                    [index]: {
                        size,
                        type,
                        normalized,
                        stride,
                        offset
                    }
                };

                glVertexAttribPointer(index, size, type, normalized, stride, offset);
            } else {
                if (typeof this.vertexAttribPointers[this.vertexArray][index] === "undefined") {
                    this.vertexAttribPointers[this.vertexArray][index] = {
                        size,
                        type,
                        normalized,
                        stride,
                        offset
                    };

                    glVertexAttribPointer(index, size, type, normalized, stride, offset);

                    return;
                }

                const {
                    size: currentSize,
                    type: currentType,
                    normalized: currentNormalized,
                    stride: currentStride,
                    offset: currentOffset
                } = this.vertexAttribPointers[this.vertexArray][index];

                if (currentSize !== size || currentType !== type
                    || currentNormalized !== normalized || currentStride !== stride
                    || currentOffset !== offset) {
                        this.vertexAttribPointers[this.vertexArray][index] = {
                            size,
                            type,
                            normalized,
                            stride,
                            offset
                        };

                        glVertexAttribPointer(index, size, type, normalized, stride, offset);
                }
            }
        }
    }

    public static enableVertexAttrib(index: number): void {
        if (typeof this.enabledVertexAttribs[this.vertexArray] === "undefined") {
            this.enabledVertexAttribs[this.vertexArray] = [];
        }

        if (!this.enabledVertexAttribs[this.vertexArray].includes(index)) {
            glEnableVertexAttribArray(index);
            this.enabledVertexAttribs[this.vertexArray].push(index);
        }
    }

    public static bindBuffer(target: number, buffer: number): void {
        if (this.currentBuffers[target] !== buffer) {
            this.currentBuffers[target] = buffer;
            glBindBuffer(target, buffer);
        }
    }

    static {
        for (let i = 0; i < 32; i++) {
            this.currentTextures[i] = {};
        }
    }
}