import { IFLabelConfig } from "@flashist/flibs";
import { SimpleButtonState } from "./SimpleButtonState";

export const SimpleButtonDefaultConfig = {
    // We need this param in both states and root,
    // because we need a correct label config
    // at the moment of creationg of the FLabel instance
    labelConfig: null as IFLabelConfig,

    bgConfig: {
        // 0.001 to make sure the bg is drawn, but is almost invisible
        bgAlpha: 0.001,
        bgColor: 0x000000,
        bgLineWidth: 0,
        bgLineColor: 0x000000,
        bgLineAlpha: 0,
        bgCornerRadius: 0,
        contentToBgPaddingX: 0,
        contentToBgPaddingY: 0,
        contentToBgShiftX: 0,
        contentToBgShiftY: 0
    } as Partial<ISimpleButtonBgConfig>,

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

export interface ISimpleButtonBgConfig {
    bgAlpha: number,
    bgColor: number,
    bgLineWidth: number,
    bgLineColor: number,
    bgLineAlpha: number,
    bgCornerRadius: number,
    contentToBgPaddingX: number,
    contentToBgPaddingY: number,
    contentToBgShiftX: number,
    contentToBgShiftY: number
}

export interface ISingleButtonStateConfig {
    alpha?: number;
    icon?: string;
    labelConfig?: IFLabelConfig;
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