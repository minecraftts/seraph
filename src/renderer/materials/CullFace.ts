import {GL_BACK, GL_FRONT, GL_FRONT_AND_BACK} from "@minecraftts/opengl";

enum CullFace {
    FRONT_BACK = GL_FRONT_AND_BACK,
    FRONT = GL_FRONT,
    BACK = GL_BACK
}

export default CullFace;