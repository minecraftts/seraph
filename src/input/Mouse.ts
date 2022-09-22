import { glfwSetCursorPosCallback, glfwSetMouseButtonCallback, glfwSetScrollCallback, GLFWwindow, GLFW_PRESS, GLFW_RELEASE } from "@minecraftts/glfw";
import EventEmitter from "events";
import TypedEventEmitter from "typed-emitter";
import MouseEvents from "./MouseEvents";
import MouseState from "./MouseState";

export default class Mouse extends (EventEmitter as new () => TypedEventEmitter<MouseEvents>) {
    private window: GLFWwindow;

    private mouseStates: Map<number, MouseState> = new Map();

    private lastMouseY: number;
    private lastMouseX: number;

    constructor(window: GLFWwindow) {
        super();

        this.window = window;

        this.lastMouseX = 0;
        this.lastMouseY = 0;

        this.attachListeners();
    }

    private attachListeners(): void {
        glfwSetMouseButtonCallback(this.window, this.mouseButtonListener.bind(this));
        glfwSetCursorPosCallback(this.window, this.mouseMoveListener.bind(this));
        glfwSetScrollCallback(this.window, this.mouseScrollListener.bind(this));
    }

    private mouseButtonListener(window: GLFWwindow, button: number, action: number, mods: number): void {
        switch (action) {
            case GLFW_RELEASE: {
                if (this.mouseStates.has(button)) {
                    this.mouseStates.delete(button);
                }

                this.emit("mouse_up", button, mods);

                break;
            }
            case GLFW_PRESS: {
                this.mouseStates.set(button, { pressStart: performance.now() });

                this.emit("mouse_press", button, mods);
                this.emit("mouse_down", button, mods);

                break;
            }
        }
    }

    private mouseMoveListener(window: GLFWwindow, xpos: number, ypos: number): void {
        this.emit("mouse_move", xpos, ypos, xpos - this.lastMouseX, ypos - this.lastMouseY);

        this.lastMouseX = xpos;
        this.lastMouseY = ypos;
    }

    private mouseScrollListener(window: GLFWwindow, xoffset: number, yoffset: number): void {
        this.emit("mouse_scroll", xoffset, yoffset);
    }
}