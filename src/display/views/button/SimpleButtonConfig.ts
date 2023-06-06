import { IFLabelConfig } from "@flashist/flibs";
import { SimpleButtonState } from "./SimpleButtonState";

export const SimpleButtonDefaultConfig = {
    bgConfig: {
        bgAlpha: 0,
        bgColor: 0x000000,
        bgLineWidth: 0,
        bgLineColor: 0x000000,
        bgLineAlpha: 0,
        bgCornerRadius: 0,
        contentToBgPaddingX: 0,
        contentToBgPaddingY: 0,
        contentToBgShiftX: 0,
        contentToBgShiftY: 0
    } as ISimpleButtonBgConfig,
    labelConfig: {} as IFLabelConfig,
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