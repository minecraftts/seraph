import { GLFWwindow } from "@minecraftts/glfw";
import Keyboard from "./Keyboard";

type KeyCallbackFn = (this: Keyboard, window: GLFWwindow, key: number, scancode: number, action: number, mods: number) => void;

export default KeyCallbackFn;