import {Point} from "@flashist/flibs";

import {IButtonViewConfig} from "./IButtonViewConfig";

export class DefaultButtonViewConfig implements IButtonViewConfig {
    iconPadding: Point = new Point();
    iconTextureId: string = "";
    pressTextureId: string = "tools_press_bg.png";
    overTextureId: string = "tools_over_bg.png";
}