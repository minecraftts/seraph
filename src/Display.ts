import { GLFWwindow, glfwCreateWindow, glfwWindowHint, GLFW_VISIBLE, GLFW_FALSE, GLFW_FOCUS_ON_SHOW, GLFW_TRUE, GLFW_CONTEXT_VERSION_MAJOR, GLFW_CONTEXT_VERSION_MINOR, glfwMakeContextCurrent, glfwGetWindowSize, Pointer, glfwSetWindowPos, glfwShowWindow, glfwSwapBuffers, glfwPollEvents, glfwWindowShouldClose, glfwSwapInterval, glfwSetWindowSizeCallback, GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE, GLFW_OPENGL_FORWARD_COMPAT, glfwSetFramebufferSizeCallback, glfwSetWindowTitle } from "@minecraftts/glfw";
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

export default class Display extends (EventEmitter as new () => TypedEventEmitter<DisplayEvents>) {
    private window: GLFWwindow;
    private width: number;
    private height: number;
    private vsync: boolean;

    constructor(width: number = 854, height: number = 500, title: string = "") {
        super();

        if (!Seraph.isInitialized()) {
            throw new NotInitializedError();
        }

        this.width = 0;
        this.height = 0;
        this.vsync = true;

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

        glfwSetFramebufferSizeCallback(this.window, (win, width, height) => {
            glViewport(0, 0, width, height);

            this.width = width;
            this.height = height;

            this.emit("resize", width, height, width / height);
        });
    }

    public setTitle(title: string) {
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
}