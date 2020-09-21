import {
    IGenericObjectVO,
    ILoadItemConfig,
    Rectangle
} from "@flashist/flibs";

export interface IAppConfigVO extends IGenericObjectVO {
    files?: ILoadItemConfig[];

    locale?: string;
    appConfigFilePath?: string;

    /*assetsConfigFile?: ILoadItemConfig;
    localeConfigFile?: ILoadItemConfig;
    staticItemsFile?: ILoadItemConfig;*/

    startDataItems?: IGenericObjectVO[];

    targetFps?: number;
    sizeArea?: Partial<Rectangle>;

    appSettings?: any;
}