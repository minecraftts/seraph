import CullFace from "./CullFace";
import VertexOrder from "./VertexOrder";

type MaterialOptions = {
    cullFace: CullFace;
    vertexOrder: VertexOrder;

    writeDepth: boolean;
    ignoreDepth: boolean;
    faceCulling: boolean;
};

export default MaterialOptions;