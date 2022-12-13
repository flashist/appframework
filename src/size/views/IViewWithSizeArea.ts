import { Rectangle, DisplayObjectContainer } from "@flashist/flibs";

export interface IViewWithSizeArea extends DisplayObjectContainer {
    sizeArea: {x: number, y: number, height: number, width: number};
}