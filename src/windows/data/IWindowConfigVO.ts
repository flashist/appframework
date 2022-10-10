import {IConstructor} from "@flashist/fcore";

import {BaseWindow} from "../views/BaseWindow";

export interface IWindowConfigVO {
    type: string;
    RenderClass: IConstructor<BaseWindow>;
    bgConfig: {color: number, alpha: number};
}