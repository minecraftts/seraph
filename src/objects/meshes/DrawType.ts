import { GL_DYNAMIC_DRAW, GL_STATIC_DRAW } from "@minecraftts/opengl";

/**
 * Specifies a mesh draw
 */
enum DrawType {
    /**
     * 
     */
    STATIC = GL_STATIC_DRAW,
    /**
     * The mesh will be modified frequently and drawn frequently
     */
    DYNAMIC = GL_DYNAMIC_DRAW
}

export default DrawType;