import { GLFWwindow, glfwCreateWindow, glfwWindowHint, GLFW_VISIBLE, GLFW_FALSE, GLFW_FOCUS_ON_SHOW, GLFW_TRUE, GLFW_CONTEXT_VERSION_MAJOR, GLFW_CONTEXT_VERSION_MINOR, glfwMakeContextCurrent, glfwGetWindowSize, Pointer, glfwSetWindowPos, glfwShowWindow, glfwSwapBuffers, glfwPollEvents, glfwWindowShouldClose, glfwSwapInterval, glfwSetWindowSizeCallback, GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE, GLFW_OPENGL_FORWARD_COMPAT, glfwSetFramebufferSizeCallback, glfwSetWindowTitle, glfwSetInputMode, GLFW_CURSOR, GLFW_CURSOR_DISABLED, GLFW_CURSOR_NORMAL, GLFWvidmode, glfwSetWindowMonitor, glfwGetWindowPos, GLFW_DONT_CARE, glfwRawMouseMotionSupported, GLFW_RAW_MOUSE_MOTION, glfwSetWindowShouldClose } from "@minecraftts/glfw";
import { glewGetErrorString, glewInit, GLEW_OK } from "@minecraftts/opengl/glew";
import { glViewport } from "@minecraftts/opengl";
import GlewInitializationError from "./errors/GlewInitializationError";
import NotInitializedError from "./errors/NotInitializedError";
import Monitor from "./Monitor";
import Seraph from "./Seraph";
import process from "process";
import EventEmitter from "events";
import TypedEventEmitter from "typed-emitter";
import DisplayEvents from "./DisplayEvents";
import StateManager from "./StateManager";
import Keyboard from "./input/Keyboard";
import KeyState from "./input/KeyState";
import Mouse from "./input/Mouse";
import DisplayOptions from "./DisplayOptions";
import ObjectUtil from "./util/ObjectUtil";
import Subset from "./util/Subset";

/**
 * Window class
 */
export default class Display extends (EventEmitter as new () => TypedEventEmitter<DisplayEvents>) {
    private window: GLFWwindow;

    private width: number;
    private height: number;

    private vsync: boolean;
    private fullscreen: boolean;

    private posX: number;
    private posY: number;

    private keyboard: Keyboard;
    private mouse: Mouse;

    /**
     * Creates a new display
     * @param width {number} window width
     * @param height {number} window height
     * @param title {string} window title
     * @deprecated use `new Display(options?: Subset<DisplayOptions>)` instead
     * @returns {Display}
     */
    constructor(width?: number, height?: number, title?: string);
    /**
     * Creates a new display
     * @param options {Subset<DisplayOptions> | undefined} window creation options
     * @returns {Display} 
     */
    constructor(options?: Subset<DisplayOptions>);
    constructor(widthOrOptions?: number | Subset<DisplayOptions>, height?: number, title?: string) {
        super();

        const defaultOptions: DisplayOptions = {
            width: 854,
            height: 480,
            title: "Seraph",
            show: true,
            focusOnShow: true,
            context: {
                major: 3,
                minor: 3,
                forwardCompat: true
            }
        };

        let options: DisplayOptions = <DisplayOptions>{};

        if (typeof widthOrOptions === "number" || height || title) {
            options = <DisplayOptions>{
                width: <number>widthOrOptions,
                height,
                title
            };
        } else if (typeof widthOrOptions === "object") {
            options = <DisplayOptions>widthOrOptions;
        }

        ObjectUtil.deepMerge(options, defaultOptions, true);

        if (!Seraph.isInitialized()) {
            throw new NotInitializedError();
        }

        this.width = 0;
        this.height = 0;
        this.vsync = true;
        this.fullscreen = false;

        glfwWindowHint(GLFW_VISIBLE, options.show ? GLFW_TRUE : GLFW_FALSE);
        glfwWindowHint(GLFW_FOCUS_ON_SHOW, options.focusOnShow ? GLFW_TRUE : GLFW_FALSE);
        glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, options.context.major);
        glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, options.context.minor);
        glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
        glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, options.context.forwardCompat ? GLFW_TRUE : GLFW_FALSE);

        this.window = glfwCreateWindow(options.width, options.height, options.title, null, null);

        const realWidth: Pointer<number> = { $: 0 };
        const realHeight: Pointer<number> = { $: 0 };

        glfwGetWindowSize(this.window, realWidth, realHeight);
        
        const primaryMonitor: Monitor = Monitor.getPrimaryMonitor();

        glfwSetWindowPos(this.window, (primaryMonitor.getWidth() / 2) - (realWidth.$ / 2), (primaryMonitor.getHeight() / 2) - (realHeight.$ / 2));
        glfwMakeContextCurrent(this.window);

        const glewError: number = glewInit();

        if (glewError !== GLEW_OK) {
            throw new GlewInitializationError(glewGetErrorString(glewError));
        }
        
        Seraph.setGlewInit();

        this.width = realWidth.$;
        this.height = realHeight.$;
        
        const xPtr: Pointer<number> = { $: 0 };
        const yPtr: Pointer<number> = { $: 0 };

        glfwGetWindowPos(this.window, xPtr, yPtr);

        this.posX = xPtr.$;
        this.posY = yPtr.$;

        this.keyboard = new Keyboard(this.window);
        this.mouse = new Mouse(this.window);

        this.attachListeners();
    }

    private attachListeners(): void {
        glfwSetFramebufferSizeCallback(this.window, (win, width, height) => {
            glViewport(0, 0, width, height);

            this.width = width;
            this.height = height;

            this.emit("resize", width, height, width / height);
        });

        this.passthroughEvent(this.keyboard, "key_up");
        this.passthroughEvent(this.keyboard, "key_down");
        this.passthroughEvent(this.keyboard, "key_press");

        this.passthroughEvent(this.mouse, "mouse_up");
        this.passthroughEvent(this.mouse, "mouse_down");
        this.passthroughEvent(this.mouse, "mouse_press");
        
        this.passthroughEvent(this.mouse, "mouse_move");
        
        this.passthroughEvent(this.mouse, "mouse_scroll");
    }

    private passthroughEvent<T extends EventEmitter>(object: T, event: keyof DisplayEvents) {
        object.on(event, (...args) => this.emit<any>(event, ...args));
    }

    /**
     * @param title the display's new title
     */
    public setTitle(title: string): void {
        glfwSetWindowTitle(this.window, title);
    }

    /**
     * Show the window, this should always be called after creation as the window is hidden by default
     */
    public show(): void {
        glfwShowWindow(this.window);
    }

    /**
     * Poll events (keypresses, mouse movement, mouse clicks, window resize, window close, etc)
     */
    public pollEvents(): void {
        glfwPollEvents();
    }

    /**
     * Swap the back and front buffer, should be called after rendering to display frame on screen
     */
    public swapBuffers(): void {
        StateManager.setVsync(this.vsync);
        glfwSwapBuffers(this.window);
    }

    /**
     * @returns whether the window is getting ready to close, if this is `true` you should do cleanup, program exit, etc 
     */
    public shouldClose(): boolean {
        return glfwWindowShouldClose(this.window);
    }

    /**
     * @param vsync boolean indicating whether vsync should be on or off for this window
     */
    public setVsync(vsync: boolean): void {
        this.vsync = vsync;
    }

    /**
     * @returns window width in pixels
     */
    public getWidth(): number {
        return this.width;
    }

    /**
     * @returns window height in pixels 
     */
    public getHeight(): number {
        return this.height;
    }

    /**
     * Hides and locks the cursor to the window
     */
    public lockCursor(): void {
        glfwSetInputMode(this.window, GLFW_CURSOR, GLFW_CURSOR_DISABLED);
    }

    /**
     * Shows and unlocks the cursor from the window
     */
    public unlockCursor(): void {
        glfwSetInputMode(this.window, GLFW_CURSOR, GLFW_CURSOR_NORMAL);
    }

    /**
     * Switches the window in/out of fullscreen
     * @param vidMode the desired fullscreen video mode
     */
    public toggleFullscreen(vidMode?: GLFWvidmode): void {
        const xPtr: Pointer<number> = { $: 0 };
        const yPtr: Pointer<number> = { $: 0 };

        const primaryMonitor = Monitor.getPrimaryMonitor();

        glfwGetWindowPos(this.window, xPtr, yPtr);

        if (!this.fullscreen) {
            this.posX = xPtr.$;
            this.posY = yPtr.$;
        }

        glfwSetWindowMonitor(
            this.window,
            this.fullscreen ? null : primaryMonitor.getNativeHandle(),
            this.fullscreen ? this.posX : 0,
            this.fullscreen ? this.posY : 0,
            this.fullscreen ? this.width : vidMode?.width ?? primaryMonitor.getPrimaryVidMode().width,
            this.fullscreen ? this.height : vidMode?.height ?? primaryMonitor.getPrimaryVidMode().height,
            this.fullscreen ? GLFW_DONT_CARE : vidMode?.refreshRate ?? primaryMonitor.getPrimaryVidMode().refreshRate);
    }

    /**
     * @returns the underlying `GLFWwindow`
     */
    public getNativeHandle(): GLFWwindow {
        return this.window;
    }

    /**
     * @returns the underlying `Keyboard` object
     */
    public getKeyboard(): Keyboard {
        return this.keyboard;
    }

    /**
     * @param keycode the key to check press state for
     * @returns `true` if the key defined by `keycode` is currently pressed, `false` otherwise 
     */
    public getKeyDown(keycode: number): boolean {
        return this.keyboard.getKeyDown(keycode);
    }

    /**
     * @param keycode the key to get state for
     * @returns a `KeyState` if the key defined by `keycode` is currently pressed, `undefined` otherwise
     */
    public getKeyState(keycode: number): KeyState | undefined {
        return this.keyboard.getKeyState(keycode);
    }

    /**
     * Tells the window to enable/disable raw motion. Please note raw motion is not supported on all systems.
     * @param state a boolean indicating whether raw motion should be enabled or disabled for this window
     */
    public useRawMotion(state: boolean): void {
        if (glfwRawMouseMotionSupported()) {
            glfwSetInputMode(this.window, GLFW_RAW_MOUSE_MOTION, state ? GLFW_TRUE : GLFW_FALSE);
        }
    }

    /**
     * Tells the window it should close
     */
    public close(): void {
        glfwSetWindowShouldClose(this.window, <boolean><unknown>GLFW_TRUE);
    }
}