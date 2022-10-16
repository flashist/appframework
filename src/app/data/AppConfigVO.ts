import { BaseDataVO, ILoadItemConfig, Rectangle } from "@flashist/flibs";

export class AppConfigVO extends BaseDataVO {

    files?: ILoadItemConfig[];

    locale?: string;

    targetFps?: number;
    sizeArea?: Rectangle;

    // Param for app-specific settings (type can be specified in app-level classes)
    appSettings?: any;

    constructor() {
        super();

        this.explicitSourcePropertyNames.push(
            "files",
            "locale",
            "targetFps",
            "sizeArea",
            "appSettings"
        );
    }

}