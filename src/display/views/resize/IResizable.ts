import {Point} from "@flashist/flibs";

export interface IResizable {
    resizeSize: Point;
    resize(width: number, height: number);
}