type MouseEvents = {
    "mouse_up": (button: number, mods: number) => void;
    "mouse_down": (button: number, mods: number) => void;
    "mouse_press": (button: number, mods: number) => void;

    "mouse_move": (xpos: number, ypos: number, changex: number, changey: number) => void;
    
    "mouse_scroll": (dirx: number, diry: number) => void;
};

export default MouseEvents;