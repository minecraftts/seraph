import { glfwGetKeyName, glfwSetKeyCallback, GLFWwindow, GLFW_KEY_0, GLFW_KEY_1, GLFW_KEY_2, GLFW_KEY_3, GLFW_KEY_4, GLFW_KEY_5, GLFW_KEY_6, GLFW_KEY_7, GLFW_KEY_8, GLFW_KEY_9, GLFW_KEY_A, GLFW_KEY_APOSTROPHE, GLFW_KEY_B, GLFW_KEY_BACKSLASH, GLFW_KEY_BACKSPACE, GLFW_KEY_C, GLFW_KEY_CAPS_LOCK, GLFW_KEY_COMMA, GLFW_KEY_D, GLFW_KEY_DELETE, GLFW_KEY_DOWN, GLFW_KEY_E, GLFW_KEY_END, GLFW_KEY_ENTER, GLFW_KEY_EQUAL, GLFW_KEY_ESCAPE, GLFW_KEY_F, GLFW_KEY_F1, GLFW_KEY_F10, GLFW_KEY_F11, GLFW_KEY_F12, GLFW_KEY_F13, GLFW_KEY_F14, GLFW_KEY_F15, GLFW_KEY_F16, GLFW_KEY_F17, GLFW_KEY_F18, GLFW_KEY_F19, GLFW_KEY_F2, GLFW_KEY_F20, GLFW_KEY_F21, GLFW_KEY_F22, GLFW_KEY_F23, GLFW_KEY_F24, GLFW_KEY_F25, GLFW_KEY_F3, GLFW_KEY_F4, GLFW_KEY_F5, GLFW_KEY_F6, GLFW_KEY_F7, GLFW_KEY_F8, GLFW_KEY_F9, GLFW_KEY_G, GLFW_KEY_GRAVE_ACCENT, GLFW_KEY_H, GLFW_KEY_HOME, GLFW_KEY_I, GLFW_KEY_INSERT, GLFW_KEY_J, GLFW_KEY_K, GLFW_KEY_KP_0, GLFW_KEY_KP_1, GLFW_KEY_KP_2, GLFW_KEY_KP_3, GLFW_KEY_KP_4, GLFW_KEY_KP_5, GLFW_KEY_KP_6, GLFW_KEY_KP_7, GLFW_KEY_KP_8, GLFW_KEY_KP_9, GLFW_KEY_KP_ADD, GLFW_KEY_KP_DECIMAL, GLFW_KEY_KP_DIVIDE, GLFW_KEY_KP_ENTER, GLFW_KEY_KP_EQUAL, GLFW_KEY_KP_MULTIPLY, GLFW_KEY_KP_SUBTRACT, GLFW_KEY_L, GLFW_KEY_LAST, GLFW_KEY_LEFT, GLFW_KEY_LEFT_ALT, GLFW_KEY_LEFT_BRACKET, GLFW_KEY_LEFT_CONTROL, GLFW_KEY_LEFT_SHIFT, GLFW_KEY_LEFT_SUPER, GLFW_KEY_M, GLFW_KEY_MENU, GLFW_KEY_MINUS, GLFW_KEY_N, GLFW_KEY_NUM_LOCK, GLFW_KEY_O, GLFW_KEY_P, GLFW_KEY_PAGE_DOWN, GLFW_KEY_PAGE_UP, GLFW_KEY_PAUSE, GLFW_KEY_PERIOD, GLFW_KEY_PRINT_SCREEN, GLFW_KEY_Q, GLFW_KEY_R, GLFW_KEY_RIGHT, GLFW_KEY_RIGHT_ALT, GLFW_KEY_RIGHT_BRACKET, GLFW_KEY_RIGHT_CONTROL, GLFW_KEY_RIGHT_SHIFT, GLFW_KEY_RIGHT_SUPER, GLFW_KEY_S, GLFW_KEY_SCROLL_LOCK, GLFW_KEY_SEMICOLON, GLFW_KEY_SLASH, GLFW_KEY_SPACE, GLFW_KEY_T, GLFW_KEY_TAB, GLFW_KEY_U, GLFW_KEY_UNKNOWN, GLFW_KEY_UP, GLFW_KEY_V, GLFW_KEY_W, GLFW_KEY_WORLD_1, GLFW_KEY_WORLD_2, GLFW_KEY_X, GLFW_KEY_Y, GLFW_KEY_Z, GLFW_PRESS, GLFW_RELEASE, GLFW_REPEAT } from "@minecraftts/glfw";
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

    /**
     * @param keycode the key to check press state for
     * @returns `true` if the key defined by `keycode` is currently pressed, `false` otherwise 
     */
    public getKeyDown(keycode: number): boolean {
        return this.keyStates.has(keycode);
    }

    /**
     * @param keycode the key to get state for
     * @returns a `KeyState` if the key defined by `keycode` is currently pressed, `undefined` otherwise
     */
    public getKeyState(keycode: number): KeyState | undefined {
        return this.keyStates.get(keycode);
    }

    /**
     * @param key the key to get name for 
     * @returns `string` if the key has a name, `undefined` otherwise
     */
    public static getKeyName(key: number): string | undefined {
        if (key >= 39 && key <= 96) {
            return glfwGetKeyName(key, 0);
        }

        return undefined;
    }

    public static Keys = class Keys {
        public static UNKNOWN: typeof GLFW_KEY_UNKNOWN = GLFW_KEY_UNKNOWN;
        public static SPACE: typeof GLFW_KEY_SPACE = GLFW_KEY_SPACE;
        public static APOSTROPHE: typeof GLFW_KEY_APOSTROPHE = GLFW_KEY_APOSTROPHE;
        public static COMMA: typeof GLFW_KEY_COMMA = GLFW_KEY_COMMA;
        public static MINUS: typeof GLFW_KEY_MINUS = GLFW_KEY_MINUS;
        public static PERIOD: typeof GLFW_KEY_PERIOD = GLFW_KEY_PERIOD;
        public static SLASH: typeof GLFW_KEY_SLASH = GLFW_KEY_SLASH;
        public static 0: typeof GLFW_KEY_0 = GLFW_KEY_0;
        public static 1: typeof GLFW_KEY_1 = GLFW_KEY_1;
        public static 2: typeof GLFW_KEY_2 = GLFW_KEY_2;
        public static 3: typeof GLFW_KEY_3 = GLFW_KEY_3;
        public static 4: typeof GLFW_KEY_4 = GLFW_KEY_4;
        public static 5: typeof GLFW_KEY_5 = GLFW_KEY_5;
        public static 6: typeof GLFW_KEY_6 = GLFW_KEY_6;
        public static 7: typeof GLFW_KEY_7 = GLFW_KEY_7;
        public static 8: typeof GLFW_KEY_8 = GLFW_KEY_8;
        public static 9: typeof GLFW_KEY_9 = GLFW_KEY_9;
        public static SEMICOLON: typeof GLFW_KEY_SEMICOLON = GLFW_KEY_SEMICOLON;
        public static EQUAL: typeof GLFW_KEY_EQUAL = GLFW_KEY_EQUAL;
        public static A: typeof GLFW_KEY_A = GLFW_KEY_A;
        public static B: typeof GLFW_KEY_B = GLFW_KEY_B;
        public static C: typeof GLFW_KEY_C = GLFW_KEY_C;
        public static D: typeof GLFW_KEY_D = GLFW_KEY_D;
        public static E: typeof GLFW_KEY_E = GLFW_KEY_E;
        public static F: typeof GLFW_KEY_F = GLFW_KEY_F;
        public static G: typeof GLFW_KEY_G = GLFW_KEY_G;
        public static H: typeof GLFW_KEY_H = GLFW_KEY_H;
        public static I: typeof GLFW_KEY_I = GLFW_KEY_I;
        public static J: typeof GLFW_KEY_J = GLFW_KEY_J;
        public static K: typeof GLFW_KEY_K = GLFW_KEY_K;
        public static L: typeof GLFW_KEY_L = GLFW_KEY_L;
        public static M: typeof GLFW_KEY_M = GLFW_KEY_M;
        public static N: typeof GLFW_KEY_N = GLFW_KEY_N;
        public static O: typeof GLFW_KEY_O = GLFW_KEY_O;
        public static P: typeof GLFW_KEY_P = GLFW_KEY_P;
        public static Q: typeof GLFW_KEY_Q = GLFW_KEY_Q;
        public static R: typeof GLFW_KEY_R = GLFW_KEY_R;
        public static S: typeof GLFW_KEY_S = GLFW_KEY_S;
        public static T: typeof GLFW_KEY_T = GLFW_KEY_T;
        public static U: typeof GLFW_KEY_U = GLFW_KEY_U;
        public static V: typeof GLFW_KEY_V = GLFW_KEY_V;
        public static W: typeof GLFW_KEY_W = GLFW_KEY_W;
        public static X: typeof GLFW_KEY_X = GLFW_KEY_X;
        public static Y: typeof GLFW_KEY_Y = GLFW_KEY_Y;
        public static Z: typeof GLFW_KEY_Z = GLFW_KEY_Z;
        public static LEFT_BRACKET: typeof GLFW_KEY_LEFT_BRACKET = GLFW_KEY_LEFT_BRACKET;
        public static BACKSLASH: typeof GLFW_KEY_BACKSLASH = GLFW_KEY_BACKSLASH;
        public static RIGHT_BRACKET: typeof GLFW_KEY_RIGHT_BRACKET = GLFW_KEY_RIGHT_BRACKET;
        public static GRAVE_ACCENT: typeof GLFW_KEY_GRAVE_ACCENT = GLFW_KEY_GRAVE_ACCENT;
        public static WORLD_1: typeof GLFW_KEY_WORLD_1 = GLFW_KEY_WORLD_1;
        public static WORLD_2: typeof GLFW_KEY_WORLD_2 = GLFW_KEY_WORLD_2;
        public static ESCAPE: typeof GLFW_KEY_ESCAPE = GLFW_KEY_ESCAPE;
        public static ENTER: typeof GLFW_KEY_ENTER = GLFW_KEY_ENTER;
        public static TAB: typeof GLFW_KEY_TAB = GLFW_KEY_TAB;
        public static BACKSPACE: typeof GLFW_KEY_BACKSPACE = GLFW_KEY_BACKSPACE;
        public static INSERT: typeof GLFW_KEY_INSERT = GLFW_KEY_INSERT;
        public static DELETE: typeof GLFW_KEY_DELETE = GLFW_KEY_DELETE;
        public static RIGHT: typeof GLFW_KEY_RIGHT = GLFW_KEY_RIGHT;
        public static LEFT: typeof GLFW_KEY_LEFT = GLFW_KEY_LEFT;
        public static DOWN: typeof GLFW_KEY_DOWN = GLFW_KEY_DOWN;
        public static UP: typeof GLFW_KEY_UP = GLFW_KEY_UP;
        public static PAGE_UP: typeof GLFW_KEY_PAGE_UP = GLFW_KEY_PAGE_UP;
        public static PAGE_DOWN: typeof GLFW_KEY_PAGE_DOWN = GLFW_KEY_PAGE_DOWN;
        public static HOME: typeof GLFW_KEY_HOME = GLFW_KEY_HOME;
        public static END: typeof GLFW_KEY_END = GLFW_KEY_END;
        public static CAPS_LOCK: typeof GLFW_KEY_CAPS_LOCK = GLFW_KEY_CAPS_LOCK;
        public static SCROLL_LOCK: typeof GLFW_KEY_SCROLL_LOCK = GLFW_KEY_SCROLL_LOCK;
        public static NUM_LOCK: typeof GLFW_KEY_NUM_LOCK = GLFW_KEY_NUM_LOCK;
        public static PRINT_SCREEN: typeof GLFW_KEY_PRINT_SCREEN = GLFW_KEY_PRINT_SCREEN;
        public static PAUSE: typeof GLFW_KEY_PAUSE = GLFW_KEY_PAUSE;
        public static F1: typeof GLFW_KEY_F1 = GLFW_KEY_F1;
        public static F2: typeof GLFW_KEY_F2 = GLFW_KEY_F2;
        public static F3: typeof GLFW_KEY_F3 = GLFW_KEY_F3;
        public static F4: typeof GLFW_KEY_F4 = GLFW_KEY_F4;
        public static F5: typeof GLFW_KEY_F5 = GLFW_KEY_F5;
        public static F6: typeof GLFW_KEY_F6 = GLFW_KEY_F6;
        public static F7: typeof GLFW_KEY_F7 = GLFW_KEY_F7;
        public static F8: typeof GLFW_KEY_F8 = GLFW_KEY_F8;
        public static F9: typeof GLFW_KEY_F9 = GLFW_KEY_F9;
        public static F10: typeof GLFW_KEY_F10 = GLFW_KEY_F10;
        public static F11: typeof GLFW_KEY_F11 = GLFW_KEY_F11;
        public static F12: typeof GLFW_KEY_F12 = GLFW_KEY_F12;
        public static F13: typeof GLFW_KEY_F13 = GLFW_KEY_F13;
        public static F14: typeof GLFW_KEY_F14 = GLFW_KEY_F14;
        public static F15: typeof GLFW_KEY_F15 = GLFW_KEY_F15;
        public static F16: typeof GLFW_KEY_F16 = GLFW_KEY_F16;
        public static F17: typeof GLFW_KEY_F17 = GLFW_KEY_F17;
        public static F18: typeof GLFW_KEY_F18 = GLFW_KEY_F18;
        public static F19: typeof GLFW_KEY_F19 = GLFW_KEY_F19;
        public static F20: typeof GLFW_KEY_F20 = GLFW_KEY_F20;
        public static F21: typeof GLFW_KEY_F21 = GLFW_KEY_F21;
        public static F22: typeof GLFW_KEY_F22 = GLFW_KEY_F22;
        public static F23: typeof GLFW_KEY_F23 = GLFW_KEY_F23;
        public static F24: typeof GLFW_KEY_F24 = GLFW_KEY_F24;
        public static F25: typeof GLFW_KEY_F25 = GLFW_KEY_F25;
        public static KP_0: typeof GLFW_KEY_KP_0 = GLFW_KEY_KP_0;
        public static KP_1: typeof GLFW_KEY_KP_1 = GLFW_KEY_KP_1;
        public static KP_2: typeof GLFW_KEY_KP_2 = GLFW_KEY_KP_2;
        public static KP_3: typeof GLFW_KEY_KP_3 = GLFW_KEY_KP_3;
        public static KP_4: typeof GLFW_KEY_KP_4 = GLFW_KEY_KP_4;
        public static KP_5: typeof GLFW_KEY_KP_5 = GLFW_KEY_KP_5;
        public static KP_6: typeof GLFW_KEY_KP_6 = GLFW_KEY_KP_6;
        public static KP_7: typeof GLFW_KEY_KP_7 = GLFW_KEY_KP_7;
        public static KP_8: typeof GLFW_KEY_KP_8 = GLFW_KEY_KP_8;
        public static KP_9: typeof GLFW_KEY_KP_9 = GLFW_KEY_KP_9;
        public static KP_DECIMAL: typeof GLFW_KEY_KP_DECIMAL = GLFW_KEY_KP_DECIMAL;
        public static KP_DIVIDE: typeof GLFW_KEY_KP_DIVIDE = GLFW_KEY_KP_DIVIDE;
        public static KP_MULTIPLY: typeof GLFW_KEY_KP_MULTIPLY = GLFW_KEY_KP_MULTIPLY;
        public static KP_SUBTRACT: typeof GLFW_KEY_KP_SUBTRACT = GLFW_KEY_KP_SUBTRACT;
        public static KP_ADD: typeof GLFW_KEY_KP_ADD = GLFW_KEY_KP_ADD;
        public static KP_ENTER: typeof GLFW_KEY_KP_ENTER = GLFW_KEY_KP_ENTER;
        public static KP_EQUAL: typeof GLFW_KEY_KP_EQUAL = GLFW_KEY_KP_EQUAL;
        public static LEFT_SHIFT: typeof GLFW_KEY_LEFT_SHIFT = GLFW_KEY_LEFT_SHIFT;
        public static LEFT_CONTROL: typeof GLFW_KEY_LEFT_CONTROL = GLFW_KEY_LEFT_CONTROL;
        public static LEFT_ALT: typeof GLFW_KEY_LEFT_ALT = GLFW_KEY_LEFT_ALT;
        public static LEFT_SUPER: typeof GLFW_KEY_LEFT_SUPER = GLFW_KEY_LEFT_SUPER;
        public static RIGHT_SHIFT: typeof GLFW_KEY_RIGHT_SHIFT = GLFW_KEY_RIGHT_SHIFT;
        public static RIGHT_CONTROL: typeof GLFW_KEY_RIGHT_CONTROL = GLFW_KEY_RIGHT_CONTROL;
        public static RIGHT_ALT: typeof GLFW_KEY_RIGHT_ALT = GLFW_KEY_RIGHT_ALT;
        public static RIGHT_SUPER: typeof GLFW_KEY_RIGHT_SUPER = GLFW_KEY_RIGHT_SUPER;
        public static MENU: typeof GLFW_KEY_MENU = GLFW_KEY_MENU;
        public static LAST: typeof GLFW_KEY_LAST = GLFW_KEY_LAST;
    };
}