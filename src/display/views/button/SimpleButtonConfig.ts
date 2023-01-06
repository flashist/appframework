import { IFLabelConfig } from "@flashist/flibs";

export const SimpleButtonDefaultConfig = {
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
    }
}

export interface ISingleButtonStateConfig {
    alpha: number;
}

export type SimpleButtonConfig = typeof SimpleButtonDefaultConfig;

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