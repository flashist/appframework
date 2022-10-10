import {Point} from "@flashist/flibs";

export interface IButtonViewConfig {
    iconTextureId?: string;
    iconPadding?: Point;
    pressTextureId?: string;
    overTextureId?: string;

    size?: {
        x: number,
        y: number
    };

    alphaNormal?: number;
    alphaOver?: number;
}