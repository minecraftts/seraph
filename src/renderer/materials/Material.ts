import { glAttachShader, glCompileShader, glCreateProgram, glCreateShader, glDeleteProgram, glDeleteShader, glGetProgramInfoLog, glGetProgramiv, glGetShaderInfoLog, glGetShaderiv, glGetUniformLocation, glLinkProgram, glShaderSource, glUniform1f, glUniform1i, glUniform2f, glUniform2fv, glUniform3fv, glUniform4f, glUniform4fv, glUniformMatrix4fv, GL_COMPILE_STATUS, GL_FRAGMENT_SHADER, GL_LINK_STATUS, GL_VERTEX_SHADER, Pointer } from "@minecraftts/opengl";
import fs from "fs";
import StateManager from "../../StateManager";
import MaterialOptions from "./MaterialOptions";
import MaterialUniformType from "./MaterialUniformType";

type ElementType < T extends ReadonlyArray <unknown>> = T extends ReadonlyArray<infer ElementType>
    ? ElementType
    : never

export default class Material<T extends Record<string, MaterialUniformType> = {}> {
    private vertexSrc: string;
    private fragmentSrc: string;
    private program: number = -1;

    private registeredUniforms: Record<keyof T, { type: T[keyof T], loc: number, value?: unknown }>;
    private uniformLocations: Map<string, number> = new Map();

    constructor(options: MaterialOptions) {
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

        this.registeredUniforms = <typeof this.registeredUniforms>{};
        this.compile();
    }

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

    public hasUniform(key: string): boolean {
        return key in this.registeredUniforms;
    }

    public hasAllUniforms(keys: string[]): this is Material<Record<typeof keys[number], MaterialUniformType>> {
        for (const key of keys) {
            if (!(key in this.registeredUniforms)) return false;
        }

        return true;
    }

    public use(): void {
        StateManager.useProgram(this.program);
    }
}