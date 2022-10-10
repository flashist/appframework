import {DisplayObjectContainer} from "@flashist/flibs";

export interface IToggleGroupItem extends DisplayObjectContainer {
    id: string;
    selected: boolean;
}