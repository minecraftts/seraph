import { glfwGetMonitors, glfwGetMonitorWorkarea, glfwGetPrimaryMonitor, glfwGetVideoMode, glfwGetVideoModes, GLFWmonitor, GLFWvidmode, Pointer } from "@minecraftts/glfw";
import NotInitializedError from "./errors/NotInitializedError";
import Seraph from "./Seraph";

export default class Monitor {
    private native: GLFWmonitor;
    private primaryVidMode: GLFWvidmode;

    private constructor(native: GLFWmonitor) {
        this.native = native;
        this.primaryVidMode = glfwGetVideoMode(this.native);
    }

    public getPos(): { x: number, y: number} {
        if (!Seraph.isInitialized()) {
            throw new NotInitializedError();
        }

        const x: Pointer<number> = { $: 0 };
        const y: Pointer<number> = { $: 0 };

        return { x: x.$, y: y.$ };
    }

    public getWidth(): number {
        if (!Seraph.isInitialized()) {
            throw new NotInitializedError();
        }

        return this.primaryVidMode.width;
    }

    public getHeight(): number {
        if (!Seraph.isInitialized()) {
            throw new NotInitializedError();
        }

        return this.primaryVidMode.height;
    }

    public getRefreshRate(): number {
        return this.primaryVidMode.refreshRate;
    }

    public getPrimaryVidMode(): GLFWvidmode {
        if (!Seraph.isInitialized()) {
            throw new NotInitializedError();
        }

        return this.primaryVidMode;
    }

    public getAllVidModes(): GLFWvidmode[] {
        if (!Seraph.isInitialized()) {
            throw new NotInitializedError();
        }

        return glfwGetVideoModes(this.native, { $: 0 });
    }

    public getNativeHandle(): GLFWmonitor {
        return this.native;
    }

    public static getPrimaryMonitor(): Monitor {
        if (!Seraph.isInitialized()) {
            throw new NotInitializedError();
        }

        return new Monitor(glfwGetPrimaryMonitor());
    }

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