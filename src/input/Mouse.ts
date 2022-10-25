import {
    glfwSetCursorPosCallback,
    glfwSetMouseButtonCallback,
    glfwSetScrollCallback,
    GLFWwindow,
    GLFW_MOUSE_BUTTON_1,
    GLFW_MOUSE_BUTTON_2,
    GLFW_MOUSE_BUTTON_3,
    GLFW_MOUSE_BUTTON_4,
    GLFW_MOUSE_BUTTON_5,
    GLFW_MOUSE_BUTTON_6,
    GLFW_MOUSE_BUTTON_7,
    GLFW_MOUSE_BUTTON_8,
    GLFW_MOUSE_BUTTON_LAST,
    GLFW_MOUSE_BUTTON_LEFT,
    GLFW_MOUSE_BUTTON_MIDDLE,
    GLFW_MOUSE_BUTTON_RIGHT,
    GLFW_PRESS,
    GLFW_RELEASE,
    glfwGetCursorPos
} from "@minecraftts/glfw";
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

    /**
     * Returns the mouse cursor's X coordinate
     * @returns {number} mouse x coordinate
     */
    public getMouseX(): number {
        const xPointer = { $: 0 };

        glfwGetCursorPos(this.window, xPointer, { $: 0 });

        return xPointer.$;
    }

    /**
     * Returns the mouse cursor's Y coordinate
     * @returns {number} mouse y coordinate
     */
    public getMouseY(): number {
        const yPointer = { $: 0 };

        glfwGetCursorPos(this.window, { $: 0 }, yPointer);

        return yPointer.$;
    }

    /**
     * @param button the button to check press state for
     * @returns `true` if the mouse button defined by `button` is currently pressed, `false` otherwise
     */
    public getButtonDown(button: number): boolean {
        return this.mouseStates.has(button);
    }

    /**
     * @param button the button to get state for
     * @returns a `MouseState` if the key defined by `keycode` is currently pressed, `undefined` otherwise
     */
    public getButtonState(button: number): MouseState | undefined {
        return this.mouseStates.get(button);
    }

    public static Buttons = class Buttons {
        public static BUTTON_1: typeof GLFW_MOUSE_BUTTON_1 = GLFW_MOUSE_BUTTON_1;
        public static BUTTON_2: typeof GLFW_MOUSE_BUTTON_2 = GLFW_MOUSE_BUTTON_2;
        public static BUTTON_3: typeof GLFW_MOUSE_BUTTON_3 = GLFW_MOUSE_BUTTON_3;
        public static BUTTON_4: typeof GLFW_MOUSE_BUTTON_4 = GLFW_MOUSE_BUTTON_4;
        public static BUTTON_5: typeof GLFW_MOUSE_BUTTON_5 = GLFW_MOUSE_BUTTON_5;
        public static BUTTON_6: typeof GLFW_MOUSE_BUTTON_6 = GLFW_MOUSE_BUTTON_6;
        public static BUTTON_7: typeof GLFW_MOUSE_BUTTON_7 = GLFW_MOUSE_BUTTON_7;
        public static BUTTON_8: typeof GLFW_MOUSE_BUTTON_8 = GLFW_MOUSE_BUTTON_8;
        public static BUTTON_LAST: typeof GLFW_MOUSE_BUTTON_LAST = GLFW_MOUSE_BUTTON_LAST;
        public static BUTTON_LEFT: typeof GLFW_MOUSE_BUTTON_LEFT = GLFW_MOUSE_BUTTON_LEFT;
        public static BUTTON_RIGHT: typeof GLFW_MOUSE_BUTTON_RIGHT = GLFW_MOUSE_BUTTON_RIGHT;
        public static BUTTON_MIDDLE: typeof GLFW_MOUSE_BUTTON_MIDDLE = GLFW_MOUSE_BUTTON_MIDDLE;
    };
}