import { GLFWwindow, glfwCreateWindow, glfwWindowHint, GLFW_VISIBLE, GLFW_FALSE, GLFW_FOCUS_ON_SHOW, GLFW_TRUE, GLFW_CONTEXT_VERSION_MAJOR, GLFW_CONTEXT_VERSION_MINOR, glfwMakeContextCurrent, glfwGetWindowSize, Pointer, glfwSetWindowPos, glfwShowWindow, glfwSwapBuffers, glfwPollEvents, glfwWindowShouldClose, glfwSwapInterval, glfwSetWindowSizeCallback, GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE, GLFW_OPENGL_FORWARD_COMPAT, glfwSetFramebufferSizeCallback, glfwSetWindowTitle, glfwSetInputMode, GLFW_CURSOR, GLFW_CURSOR_DISABLED, GLFW_CURSOR_NORMAL, GLFWvidmode, glfwSetWindowMonitor, glfwGetWindowPos, GLFW_DONT_CARE, glfwRawMouseMotionSupported, GLFW_RAW_MOUSE_MOTION } from "@minecraftts/glfw";
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

export default class Display extends (EventEmitter as new () => TypedEventEmitter<DisplayEvents>) {
    private window: GLFWwindow;

    private width: number;
    private height: number;

    private vsync: boolean;
    private fullscreen: boolean;

    private posX: number;
    private posY: number;

    private keyboard: Keyboard;

    constructor(width: number = 854, height: number = 500, title: string = "Seraph") {
        super();

        if (!Seraph.isInitialized()) {
            throw new NotInitializedError();
        }

        this.width = 0;
        this.height = 0;
        this.vsync = true;
        this.fullscreen = false;

        glfwWindowHint(GLFW_VISIBLE, GLFW_FALSE);
        glfwWindowHint(GLFW_FOCUS_ON_SHOW, GLFW_TRUE);
        glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
        glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
        glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

        if (process.platform === "darwin") {
            glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GLFW_TRUE);
        }

        this.window = glfwCreateWindow(width, height, title, null, null);

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

        this.attachListeners();
    }

    private attachListeners(): void {
        glfwSetFramebufferSizeCallback(this.window, (win, width, height) => {
            glViewport(0, 0, width, height);

            this.width = width;
            this.height = height;

            this.emit("resize", width, height, width / height);
        });

        this.keyboard.on("key_down", (...args) => this.emit("key_down", ...args));
        this.keyboard.on("key_press", (...args) => this.emit("key_press", ...args))
    }

    public setTitle(title: string): void {
        glfwSetWindowTitle(this.window, title);
    }

    public show(): void {
        glfwShowWindow(this.window);
    }

    public pollEvents(): void {
        glfwPollEvents();
    }

    public swapBuffers(): void {
        StateManager.setVsync(this.vsync);
        glfwSwapBuffers(this.window);
    }

    public shouldClose(): boolean {
        return glfwWindowShouldClose(this.window);
    }

    public setVsync(vsync: boolean): void {
        this.vsync = vsync;
    }

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    public lockCursor(): void {
        glfwSetInputMode(this.window, GLFW_CURSOR, GLFW_CURSOR_DISABLED);
    }

    public unlockCursor(): void {
        glfwSetInputMode(this.window, GLFW_CURSOR, GLFW_CURSOR_NORMAL);
    }

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

    public getNativeHandle(): GLFWwindow {
        return this.window;
    }

    public getKeyboard(): Keyboard {
        return this.keyboard;
    }

    public getKeyDown(keycode: number): boolean {
        return this.keyboard.getKeyDown(keycode);
    }

    public getKeyState(keycode: number): KeyState | undefined {
        return this.keyboard.getKeyState(keycode);
    }

    public useRawMotion(state: boolean): void {
        if (glfwRawMouseMotionSupported()) {
            glfwSetInputMode(this.window, GLFW_RAW_MOUSE_MOTION, state ? GLFW_TRUE : GLFW_FALSE);
        }
    }
}