import { GL_BYTE, GL_FLOAT, GL_INT, GL_SHORT, GL_UNSIGNED_BYTE, GL_UNSIGNED_INT, GL_UNSIGNED_SHORT } from "@minecraftts/opengl";
import BufferAttribTypes from "../renderer/BufferAttribTypes";

export default class GLUtil {
    public static bufferAttribWidth(type: BufferAttribTypes): number {
        switch (type) {
            case GL_BYTE:
            case GL_UNSIGNED_BYTE:
                return 1;
            case GL_SHORT:
            case GL_UNSIGNED_SHORT:
                return 2;
            case GL_INT:
            case GL_UNSIGNED_INT:
            case GL_FLOAT:
                return 4;
        }
    }
}