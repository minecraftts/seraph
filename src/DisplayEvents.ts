import KeyboardEvents from "./input/KeyboardEvents";
import MouseEvents from "./input/MouseEvents";

type DisplayEvents = {
    "resize": (width: number, height: number, ratio: number) => void;
} & KeyboardEvents & MouseEvents;

export default DisplayEvents;