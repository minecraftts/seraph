import Constants from "./Constants";
import Display from "./Display";
import DisplayEvents from "./DisplayEvents";
import DeletedError from "./errors/DeletedError";
import GlewInitializationError from "./errors/GlewInitializationError";
import NotImplementedError from "./errors/NotImplementedError";
import NotInitializedError from "./errors/NotInitializedError";
import SeraphInitializationError from "./errors/SeraphInitializationError";
import Keyboard from "./input/Keyboard";
import KeyboardEvents from "./input/KeyboardEvents";
import KeyState from "./input/KeyState";
import Monitor from "./Monitor";
import Camera from "./objects/cameras/Camera";
import PerspectiveCamera from "./objects/cameras/PerspectiveCamera";
import Mesh from "./objects/Mesh";
import Scene from "./objects/Scene";
import BufferAttribTypes from "./renderer/BufferAttribTypes";
import BufferAttribute from "./renderer/BufferAttribute";
import Material from "./renderer/materials/Material";
import MaterialOptions from "./renderer/materials/MaterialOptions";
import MaterialUniformType from "./renderer/materials/MaterialUniformType";
import UnlitMaterial from "./renderer/materials/UnlitMaterial";
import Renderer from "./renderer/Renderer";
import Seraph from "./Seraph";
import StateManager from "./StateManager";
import GLUtil from "./util/GLUtil";
import MathUtil from "./util/MathUtil";

Seraph.initialize();
const display = new Display();

display.show();

while (!display.shouldClose()) {
    display.pollEvents();
}

export {
    Seraph,

    Constants,
    Display,
    DisplayEvents,
    Monitor,
    StateManager,

    DeletedError,
    GlewInitializationError,
    NotImplementedError,
    NotInitializedError,
    SeraphInitializationError,

    Keyboard,
    KeyboardEvents,
    KeyState,

    Camera,
    PerspectiveCamera,

    Mesh,
    Scene,

    Material,
    MaterialOptions,
    MaterialUniformType,
    UnlitMaterial,

    BufferAttribTypes,
    BufferAttribute,
    Renderer,

    GLUtil,
    MathUtil
};