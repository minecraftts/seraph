import path from "path";

export default class Constants {
    /**
     * The directory where built-in Seraph shaders are stored
     */
    public static SERAPH_SHADER_DIR: string = path.join(__dirname, "../shaders");
}