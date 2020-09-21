import {
    DisplayObjectContainer
} from "@flashist/flibs";

export interface IToggableItem extends DisplayObjectContainer {
    id?: string;
    selected: boolean;
}