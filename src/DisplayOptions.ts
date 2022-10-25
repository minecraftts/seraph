import {BufferedImage} from "@minecraftts/buffered-image";

type DisplayOptions = {
    width: number;
    height: number;
    title: string;
    show: boolean;
    focusOnShow: boolean;
    icon?: BufferedImage | string;
    context: ({
        major: 1;
        minor: 1 | 2 | 3 | 4 | 5;
    } | {
        major: 2;
        minor: 0 | 1;
    } | {
        major: 3;
        minor: 0 | 1 | 2 | 3;
    } | {
        major: 4;
        minor: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    }) & {
        forwardCompat: boolean;
    };
};

export default DisplayOptions;