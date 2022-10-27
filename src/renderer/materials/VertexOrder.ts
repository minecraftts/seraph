import {GL_CCW, GL_CW} from "@minecraftts/opengl";

/**
 * Specifies the vertex winding order, by default all built in Seraph meshes use counter-clockwise which is default in OpenGL
 */
enum VertexOrder {
    CLOCKWISE = GL_CW,
    COUNTER_CLOCKWISE = GL_CCW
}

export default VertexOrder;