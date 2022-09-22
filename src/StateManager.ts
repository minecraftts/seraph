import { glfwSwapInterval } from "@minecraftts/glfw";
import { glBindTexture, glUseProgram } from "@minecraftts/opengl";

export default class StateManager {
    private static currentProgram: number = -1;
    private static currentTextures: Record<number, number> = {};
    private static vsync: boolean;

    public static useProgram(program: number): void {
        if (this.currentProgram === program) {
            return;
        }

        glUseProgram(program);
    }

    public static bindTexture(target: number, texture: number): void {
        if (this.currentTextures[target] === texture) {
            return;
        }

        glBindTexture(target, texture);
        this.currentTextures[target] = texture;
    }

    public static setVsync(state: boolean) {
        if (this.vsync !== state) {
            this.vsync = state;
            glfwSwapInterval(this.vsync ? 1 : 0);
        }
    }
}