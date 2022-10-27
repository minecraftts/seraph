import {
    GL_COMPILE_STATUS, GL_CULL_FACE, GL_DEPTH_TEST,
    GL_FRAGMENT_SHADER,
    GL_LINK_STATUS,
    GL_VERTEX_SHADER,
    glAttachShader,
    glCompileShader,
    glCreateProgram,
    glCreateShader, glCullFace,
    glDeleteProgram,
    glDeleteShader, glDepthMask, glDisable, glEnable, glFrontFace,
    glGetProgramInfoLog,
    glGetProgramiv,
    glGetShaderInfoLog,
    glGetShaderiv,
    glGetUniformLocation,
    glLinkProgram,
    glShaderSource,
    glUniform1f,
    glUniform1i,
    glUniform2fv,
    glUniform3fv,
    glUniform4fv,
    glUniformMatrix4fv,
    Pointer
} from "@minecraftts/opengl";
import fs from "fs";
import StateManager from "../../StateManager";
import Texture from "../textures/Texture";
import MaterialOptions from "./MaterialOptions";
import MaterialUniformType from "./MaterialUniformType";
import MaterialSourceOptions from "./MaterialSourceOptions";
import Subset from "../../util/Subset";
import ObjectUtil from "../../util/ObjectUtil";
import CullFace from "./CullFace";
import VertexOrder from "./VertexOrder";

/**
 * Base material class
 */
export default class Material<T extends Record<string, MaterialUniformType> = {}, O extends {} = {}> {
    private vertexSrc: string;
    private fragmentSrc: string;
    private program: number = -1;

    private registeredUniforms: Record<keyof T, { type: T[keyof T], loc: number, value?: unknown }>;

    private textures: Texture[] = new Array(16);

    protected options: MaterialOptions & O = <any>{};

    constructor(options: MaterialSourceOptions & Subset<MaterialOptions> & Subset<O>, defaultOptions: O & Subset<MaterialOptions> = <O>{}) {
        if (("vertexSrc" in options) && ("fragmentSrc" in options)) {
            this.vertexSrc = options.vertexSrc;
            this.fragmentSrc = options.fragmentSrc;
        } else if (("vertexSrc" in options) || ("fragmentSrc" in options)) {
            throw new Error("expected vertexSrc and fragmentSrc to be present in options, only found 1");
        } else if (("vertexPath" in options) && ("fragmentPath" in options)) {
            this.vertexSrc = fs.readFileSync(options.vertexPath, "utf8");
            this.fragmentSrc = fs.readFileSync(options.fragmentPath, "utf8");
        } else if (("vertexPath" in options) || ("fragmentPath" in options)) {
            throw new Error("expected vertexPath and fragmentPath to be present in options, only found 1");
        } else {
            throw new Error("expected either vertexPath and fragmentPath or vertexSrc and fragmentSrc to be present in options, found none");
        }

        const defaultMaterialOptions: MaterialOptions = {
            cullFace: CullFace.BACK,
            vertexOrder: VertexOrder.COUNTER_CLOCKWISE,

            writeDepth: true,
            ignoreDepth: false,
            faceCulling: true
        };

        ObjectUtil.deepMerge(defaultOptions, defaultMaterialOptions, true);
        ObjectUtil.deepMerge(options, defaultOptions, true);

        this.options = <MaterialOptions & O><unknown>options;

        this.registeredUniforms = <typeof this.registeredUniforms>{};
        this.compile();
    }

    /**
     * Registers a uniform and gets it's location
     * @param key uniform name
     * @param type uniform type
     */
    protected registerUniform(key: keyof T, type: T[keyof T]): void {
        const location = glGetUniformLocation(this.program, <string>key);

        if (location === -1) {
            console.warn(`could not register uniform ${<string>key} because it could not be found.`);
            return;
        }

        this.registeredUniforms[key] = {
            type,
            loc: location,
            value: undefined
        };
    }

    /**
     * Compiles the material
     */
    public compile(): void {
        const vertexShader: number = glCreateShader(GL_VERTEX_SHADER);
        const fragmentShader: number = glCreateShader(GL_FRAGMENT_SHADER);

        const status: Int32Array = new Int32Array(1);
        const infoLog: Pointer<string> = { $: "" };

        glShaderSource(vertexShader, 1, this.vertexSrc, this.vertexSrc.length);
        glCompileShader(vertexShader);
        glGetShaderiv(vertexShader, GL_COMPILE_STATUS, status);

        if (!status[0]) {
            glGetShaderInfoLog(vertexShader, 512, { $: 0 }, infoLog);

            console.error(`Failed to compile vertex shader: ${infoLog.$}`);

            glDeleteShader(vertexShader);

            return;
        }

        glShaderSource(fragmentShader, 1, this.fragmentSrc, this.fragmentSrc.length);
        glCompileShader(fragmentShader);
        glGetShaderiv(fragmentShader, GL_COMPILE_STATUS, status);

        if (!status[0]) {
            glGetShaderInfoLog(fragmentShader, 512, { $: 0 }, infoLog);

            console.error(`Failed to compile fragment shader: ${infoLog.$}`);

            glDeleteShader(vertexShader);
            glDeleteShader(fragmentShader);

            return;
        }

        this.program = glCreateProgram();

        glAttachShader(this.program, vertexShader);
        glAttachShader(this.program, fragmentShader);
        glLinkProgram(this.program);

        glGetProgramiv(this.program, GL_LINK_STATUS, status);

        if (!status[0]) {
            glGetProgramInfoLog(this.program, 512, { $: 0 }, infoLog);

            console.error(`Failed to link program: ${infoLog.$}`);

            glDeleteProgram(this.program);
            glDeleteShader(vertexShader);
            glDeleteShader(fragmentShader);

            return;
        }

        glDeleteShader(vertexShader);
        glDeleteShader(fragmentShader);
    }

    /**
     * Sets a uniform, the type of the value is determined in the call to `registerUniform`
     * @param key uniform name
     * @param value uniform value
     */
    public setUniform(key: keyof T, value: unknown): void {
        if (key in this.registeredUniforms) {
            const {
                type,
                loc
            } = this.registeredUniforms[key];

            switch (<MaterialUniformType>type) {
                case "vec2": {
                    glUniform2fv(loc, 1, <Float32Array>value);
                    break;
                }
                case "vec3": {
                    glUniform3fv(loc, 1, <Float32Array>value);
                    break;
                }
                case "vec4": {
                    glUniform4fv(loc, 1, <Float32Array>value);
                    break;
                }
                case "mat4x4": {
                    glUniformMatrix4fv(loc, 1, false, <Float32Array>value);
                    break;
                }
                case "int": {
                    glUniform1i(loc, <number>value);
                    break;
                }
                case "float": {
                    glUniform1f(loc, <number>value);
                    break;
                }
                case "bool": {
                    glUniform1i(loc, (<boolean>value) ? 1 : 0);
                    break;
                }
            }
        }
    }

    /**
     * @param key uniform name
     * @returns `true` if the material has a uniform named by `key`, `false` otherwise
     */
    public hasUniform<T extends string>(key: T): this is Material<Record<T, MaterialUniformType>> {
        return key in this.registeredUniforms;
    }

    /**
     * 
     * @param keys array of uniform names
     * @returns `true` if the material has all the uniforms specified by `keys`, `false` otherwise
     */
    public hasAllUniforms(keys: string[]): this is Material<Record<typeof keys[number], MaterialUniformType>> {
        for (const key of keys) {
            if (!(key in this.registeredUniforms)) return false;
        }

        return true;
    }

    /**
     * Binds a texture to a specific unit whenever a mesh with this material is drawn
     * @param texture {Texture} texture to bind
     * @param unit {number?} optional number specifying the texture unit
     * @returns {void}
     */
    public setTexture(texture: Texture, unit: number = 0): void {
        this.textures[unit] = texture;
    }

    /**
     * Binds all current textures
     * @returns {void}
     */
    public bindTextures(): void {
        for (let i = 0; i < this.textures.length; i++) {
            const texture = this.textures[i];

            if (texture) {
                StateManager.setTextureUnit(i);
                texture.use();
            }
        }
    }

    /**
     * Binds the material
     */
    public use(): void {
        StateManager.useProgram(this.program);

        if (this.options.faceCulling) {
            glEnable(GL_CULL_FACE);
        } else {
            glDisable(GL_CULL_FACE);
        }

        if (this.options.ignoreDepth) {
            glDisable(GL_DEPTH_TEST);
        } else {
            glDepthMask(this.options.writeDepth);
            glEnable(GL_DEPTH_TEST);
        }

        glCullFace(this.options.cullFace);
        glFrontFace(this.options.vertexOrder);
    }
}