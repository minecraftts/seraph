import { glfwGetVersion, glfwInit, glfwTerminate, Pointer } from "@minecraftts/glfw";
import { glGetString, GL_VERSION } from "@minecraftts/opengl";
import { glewGetString, GLEW_VERSION } from "@minecraftts/opengl/glew";
import SeraphInitializationError from "./errors/SeraphInitializationError";
import NotInitializedError from "./errors/NotInitializedError";
import Versions from "./Versions";

/**
 * Main class for Seraph. `Seraph.initialize()` must be called before calling any other Seraph code.
 */
export default class Seraph {
    private static initialized: boolean = false;
    private static glewInitialized: boolean = false;

    /**
     * Initialize Seraph
     */
    public static initialize() {
        if (!glfwInit()) {
            throw new SeraphInitializationError("failed to initialize glfw");
        }

        this.initialized = true;
    }

    /**
     * Frees any resources used by Seraph
     */
    public static cleanup() {
        if (!this.initialized) {
            throw new NotInitializedError();
        }

        glfwTerminate();

        this.initialized = false;
        this.glewInitialized = false;
    }

    /**
     * Checks if Seraph is initialized
     * @returns {boolean} `true` if Seraph is initialized, `false` otherwise
     */
    public static isInitialized(): boolean {
        return this.initialized;
    }

    /**
     * Sets flag telling Seraph GLEW is initialized. You probably shouldn't call this unless you're manually doing window / OpenGL context creation.
     */
    public static setGlewInit(): void {
        if (!this.initialized) {
            throw new NotInitializedError();
        }

        this.glewInitialized = true;
    }

    /**
     * Returns versions for all libraries
     * 
     * `versions.glfw` is always present and is set to the GLFW version exposed by `@minecraftts/glfw`
     * `versions.glew` is present only after initializing GLEW and an OpenGL context. It is set to the GLEW version exposed by `@minecraftts/opengl`
     * `versions.opengl` is present only after initializing an OpenGL context. It is set to your system's OpenGL version or the context's OpenGL version.
     * @returns {Versions} an object containing versions for glfw, glew and opengl
     */
    public static getVersions(): Versions {
        if (!this.initialized) {
            throw new NotInitializedError();
        }

        const glfwMajor: Pointer<number> = { $: 0 };
        const glfwMinor: Pointer<number> = { $: 0 };
        const glfwPatch: Pointer<number> = { $: 0 };

        glfwGetVersion(glfwMajor, glfwMinor, glfwPatch);

        const versions: Versions = {
            glfw: `${glfwMajor.$}.${glfwMinor.$}.${glfwPatch.$}`
        };

        if (this.glewInitialized) {
            versions.glew = glewGetString(GLEW_VERSION)
            versions.opengl = glGetString(GL_VERSION);
        }

        return versions;
    }
}