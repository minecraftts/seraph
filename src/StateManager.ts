import { glfwSwapInterval } from "@minecraftts/glfw";
import { GL_FRAMEBUFFER, glBindFramebuffer, glBindTexture, glUseProgram } from "@minecraftts/opengl";

/**
 * General utility class to manage the OpenGL state
 */
export default class StateManager {
    private static currentProgram: number = -1;
    private static currentTextures: Record<number, number> = {};
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
        if (this.currentTextures[target] === texture) {
            return;
        }

        glBindTexture(target, texture);
        
        this.currentTextures[target] = texture;
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
        return this.currentTextures[target];
    }

    public static setTextureUnit(unit: number): void {

    }

    public static unbindFramebuffer(): void {
        glBindFramebuffer(GL_FRAMEBUFFER, 0);
    }
}