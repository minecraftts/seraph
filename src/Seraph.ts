import { glfwGetVersion, glfwInit, glfwTerminate, Pointer } from "@minecraftts/glfw";
import { glGetString, GL_VERSION } from "@minecraftts/opengl";
import { glewGetString, GLEW_VERSION } from "@minecraftts/opengl/glew";
import SeraphInitializationError from "./errors/SeraphInitializationError";
import NotInitializedError from "./errors/NotInitializedError";
import IVersions from "./IVersions";

export default class Seraph {
    private static initialized: boolean = false;
    private static glewInitialized: boolean = false;

    public static initialize() {
        if (!glfwInit()) {
            throw new SeraphInitializationError("failed to initialize glfw");
        }

        this.initialized = true;
    }

    public static cleanup() {
        if (!this.initialized) {
            throw new NotInitializedError();
        }

        glfwTerminate();

        this.initialized = false;
        this.glewInitialized = false;
    }

    public static isInitialized(): boolean {
        return this.initialized;
    }

    public static setGlewInit() {
        if (!this.initialized) {
            throw new NotInitializedError();
        }

        this.glewInitialized = true;
    }

    public static getVersions(): IVersions {
        if (!this.initialized) {
            throw new NotInitializedError();
        }

        const glfwMajor: Pointer<number> = { $: 0 };
        const glfwMinor: Pointer<number> = { $: 0 };
        const glfwPatch: Pointer<number> = { $: 0 };

        glfwGetVersion(glfwMajor, glfwMinor, glfwPatch);

        const versions: IVersions = {
            glfw: `${glfwMajor.$}.${glfwMinor.$}.${glfwPatch.$}`
        };

        if (this.glewInitialized) {
            versions.glew = glewGetString(GLEW_VERSION)
            versions.opengl = glGetString(GL_VERSION);
        }

        return versions;
    }
}