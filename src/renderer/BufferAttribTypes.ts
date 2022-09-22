import { GL_BYTE, GL_FLOAT, GL_INT, GL_SHORT, GL_UNSIGNED_BYTE, GL_UNSIGNED_INT, GL_UNSIGNED_SHORT } from "@minecraftts/opengl";

type BufferAttribTypes = typeof GL_BYTE
    | typeof GL_UNSIGNED_BYTE
    | typeof GL_SHORT
    | typeof GL_UNSIGNED_SHORT
    | typeof GL_INT
    | typeof GL_UNSIGNED_INT
    | typeof GL_FLOAT;

export default BufferAttribTypes;