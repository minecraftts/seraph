import { GL_DYNAMIC_DRAW, GL_STATIC_DRAW } from "@minecraftts/opengl";

/**
 * Specifies a mesh draw type
 */
enum DrawType {
    /**
     * The mesh will be modified once or twice and drawn frequently
     */
    STATIC = GL_STATIC_DRAW,
    /**
     * The mesh will be modified frequently and drawn frequently
     */
    DYNAMIC = GL_DYNAMIC_DRAW
}

export default DrawType;