import { glfwGetKeyName, glfwSetKeyCallback, GLFWwindow, GLFW_PRESS, GLFW_RELEASE, GLFW_REPEAT } from "@minecraftts/glfw";
import EventEmitter from "events";
import TypedEventEmitter from "typed-emitter";
import KeyboardEvents from "./KeyboardEvents";
import KeyState from "./KeyState";

export default class Keyboard extends (EventEmitter as new () => TypedEventEmitter<KeyboardEvents>) {
    private window: GLFWwindow;
    private keyStates: Map<number, KeyState> = new Map();

    constructor(window: GLFWwindow) {
        super();

        this.window = window;
        this.attachListeners();
    }

    private attachListeners(): void {
        glfwSetKeyCallback(this.window, this.keyListener.bind(this));
    }

    private keyListener(window: GLFWwindow, key: number, scancode: number, action: number, mods: number) {
        switch (action) {
            case GLFW_RELEASE:
                if (this.keyStates.has(key)) {
                    this.keyStates.delete(key);
                }

                this.emit("key_up", key, mods);

                break;
            case GLFW_PRESS:
                this.keyStates.set(key, { pressStart: performance.now() });

                this.emit("key_press", key, mods);
                this.emit("key_down", key, mods);

                break;
            case GLFW_REPEAT:
                this.emit("key_down", key, mods);
                break;
        }
    }

    public getKeyDown(keycode: number): boolean {
        return this.keyStates.has(keycode);
    }

    public getKeyState(keycode: number): KeyState | undefined {
        return this.keyStates.get(keycode);
    }

    public static getKeyName(key: number): string | undefined {
        if (key >= 39 && key <= 96) {
            return glfwGetKeyName(key, 0);
        }

        return undefined;
    }
}