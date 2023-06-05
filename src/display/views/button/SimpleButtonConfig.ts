import { IFLabelConfig, DisplayObjectContainer } from "@flashist/flibs";
import { SimpleButtonState } from "./SimpleButtonState";

export const SimpleButtonDefaultConfig = {
    labelConfig: {} as IFLabelConfig,
    view: null as DisplayObjectContainer,
    states: {
        normal: {
            alpha: 0.75
        } as ISingleButtonStateConfig,
        over: {
            alpha: 1
        } as ISingleButtonStateConfig,
        press: {
            alpha: 1
        } as ISingleButtonStateConfig,
        disabled: {
            alpha: 0.5
        } as ISingleButtonStateConfig
    } as ISimpleButtonStatesConfig
}

export interface ISingleButtonStateConfig {
    alpha?: number;
    icon?: string;
}

export type ISimpleButtonStatesConfig = {
    [key in SimpleButtonState]?: ISingleButtonStateConfig;
}

export type SimpleButtonConfig = Partial<typeof SimpleButtonDefaultConfig>;

// export interface ISimpleButtonConfig {
//     // bgConfig?: {
//     //     image?: {
//     //         imageId: string;
//     //     };

//     //     vector?: {
//     //         bgColor: number;
//     //         overBgColor: number;
//     //         bgAlpha: number;
//     //         bgBorderColor: number;
//     //         bgBorderAlpha: number;
//     //         bgBorderWidth: number;
//     //     }

//     //     resizeBg?: boolean;
//     // };

//     labelConfig?: IFLabelConfig;
// }