type KeyboardEvents = {
    "key_up": (keycode: number, mods: number) => void;
    "key_down": (keycode: number, mods: number) => void;
    "key_press": (keycode: number, mods: number) => void;
};

export default KeyboardEvents;