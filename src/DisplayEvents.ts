import KeyboardEvents from "./input/KeyboardEvents";

type DisplayEvents = {
    "resize": (width: number, height: number, ratio: number) => void;
    "mouse_move": (x: number, y: number, changeX: number, changeY: number) => void;
} & KeyboardEvents;

export default DisplayEvents;