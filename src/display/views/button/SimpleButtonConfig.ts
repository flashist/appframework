import { DisplayObjectContainer, IFLabelConfig } from "@flashist/flibs";
import { SimpleButtonState } from "./SimpleButtonState";

export const SimpleButtonDefaultConfig = {

    defaultState: {
        labelConfig: {
            autosize: true
        } as IFLabelConfig,

        icon: {
            // none by default
        } as ISimpleButtonIconConfig,

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
        }
    } as ISingleButtonSingleStateConfig,

    states: {
        normal: {
            alpha: 0.75
        } as ISingleButtonSingleStateConfig,
        over: {
            alpha: 1
        } as ISingleButtonSingleStateConfig,
        press: {
            alpha: 1
        } as ISingleButtonSingleStateConfig,
        disabled: {
            alpha: 0.5
        } as ISingleButtonSingleStateConfig
    } as ISimpleButtonStatesConfig
}

export interface ISimpleButtonIconConfig {
    textureId?: string;
    maxWidth?: number;
    scaleByWidth?: boolean;
    maxHeight: number;
    scaleByHeight?: boolean;
    alpha?: number;
}

export interface ISimpleButtonBgConfig {
    bgAlpha?: number,
    bgColor?: number,
    bgLineWidth?: number,
    bgLineColor?: number,
    bgLineAlpha?: number,
    bgCornerRadius?: number,
    contentToBgPaddingX?: number,
    contentToBgPaddingY?: number,
    contentToBgShiftX?: number,
    contentToBgShiftY?: number
}

export interface ISingleButtonSingleStateConfig {
    alpha?: number;

    iconConfig?: ISimpleButtonIconConfig;
    labelConfig?: IFLabelConfig;
    bgConfig?: Partial<ISimpleButtonBgConfig>;
    externalView?: DisplayObjectContainer;
}

export type ISimpleButtonStatesConfig = {
    [key in SimpleButtonState]?: ISingleButtonSingleStateConfig;
}

export type SimpleButtonConfig = Partial<typeof SimpleButtonDefaultConfig>;