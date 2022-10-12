import { glfwGetMonitors, glfwGetMonitorWorkarea, glfwGetPrimaryMonitor, glfwGetVideoMode, glfwGetVideoModes, GLFWmonitor, GLFWvidmode, Pointer } from "@minecraftts/glfw";
import NotInitializedError from "./errors/NotInitializedError";
import Seraph from "./Seraph";

/**
 * Class containing methods to query monitors
 */
export default class Monitor {
    private native: GLFWmonitor;
    private primaryVidMode: GLFWvidmode;

    private constructor(native: GLFWmonitor) {
        this.native = native;
        this.primaryVidMode = glfwGetVideoMode(this.native);
    }

    /**
     * Returns the monitor's position
     * @returns an object containing the monitors position
     */
    public getPos(): { x: number, y: number} {
        if (!Seraph.isInitialized()) {
            throw new NotInitializedError();
        }

        const x: Pointer<number> = { $: 0 };
        const y: Pointer<number> = { $: 0 };

        return { x: x.$, y: y.$ };
    }

    /**
     * @returns the monitor's width in pixels
     */
    public getWidth(): number {
        if (!Seraph.isInitialized()) {
            throw new NotInitializedError();
        }

        return this.primaryVidMode.width;
    }

    /**
     * @returns the monitor's height in pixels
     */
    public getHeight(): number {
        if (!Seraph.isInitialized()) {
            throw new NotInitializedError();
        }

        return this.primaryVidMode.height;
    }

    /**
     * @returns the monitor's refresh rate 
     */
    public getRefreshRate(): number {
        return this.primaryVidMode.refreshRate;
    }

    /**
     * Returns the primary video mode of the monitor, see the [GLFWvidmode](https://www.glfw.org/docs/latest/structGLFWvidmode.html) docs for more information.
     * @returns the primary video mode of the monitor
     */
    public getPrimaryVidMode(): GLFWvidmode {
        if (!Seraph.isInitialized()) {
            throw new NotInitializedError();
        }

        return this.primaryVidMode;
    }

    /**
     * Returns the monitor's available video modes, see the [GLFWvidmode](https://www.glfw.org/docs/latest/structGLFWvidmode.html) docs for more information.
     * @returns the monitor's available video modes
     */
    public getAllVidModes(): GLFWvidmode[] {
        if (!Seraph.isInitialized()) {
            throw new NotInitializedError();
        }

        return glfwGetVideoModes(this.native, { $: 0 });
    }

    /**
     * @returns the underlying GLFWmonitor object
     */
    public getNativeHandle(): GLFWmonitor {
        return this.native;
    }

    /**
     * @returns the primary monitor
     */
    public static getPrimaryMonitor(): Monitor {
        if (!Seraph.isInitialized()) {
            throw new NotInitializedError();
        }

        return new Monitor(glfwGetPrimaryMonitor());
    }

    /**
     * @returns a list of all monitors
     */
    public static getAllMonitors(): Monitor[] {
        if (!Seraph.isInitialized()) {
            throw new NotInitializedError();
        }

        const monitors: Monitor[] = [];
        const nativeMontiors: GLFWmonitor[] = glfwGetMonitors({ $: 0 });

        for (const monitor of nativeMontiors) {
            monitors.push(new Monitor(monitor));
        }

        return monitors;
    }
}