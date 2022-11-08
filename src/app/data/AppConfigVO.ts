import { BaseDataVO, ILoadItemConfig, Rectangle } from "@flashist/flibs";

export class AppConfigVO extends BaseDataVO {

    appName: string;
    appVersion: number;

    files?: ILoadItemConfig[];

    locale?: string;

    targetFps?: number;
    sizeArea?: Rectangle;

    // Param for app-specific settings (type can be specified in app-level classes)
    fAppSettings?: any;

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