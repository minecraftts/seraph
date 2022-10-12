/**
 * Object containing versions.
 * 
 * `versions.glfw` is the glfw version exposed by `@minecraftts/glfw`
 * 
 * `versions.glew` is only present if GLEW has been initialized and an OpenGL context exists. It is set to the GLEW version exposed by `@minecraftts/opengl`
 * 
 * `versions.opengl` is only present if an OpenGL context exists. It is set to the context version or your system's OpenGL version.
 */
type Versions = {
    glew?: string;
    glfw: string;
    opengl?: string;
};

export default Versions;