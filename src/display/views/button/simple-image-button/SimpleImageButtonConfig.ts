import {SimpleImageButtonState} from "./SimpleImageButtonState";

export const SimpleImageButtonDefaultConfig = {
    states: {} as Record<string, ISimpleImageButtonStateVO>
}

export interface ISimpleImageButtonStateVO {
    imageId?: string;
    alpha?: number;
}

export type SimpleImageButtonConfig = typeof SimpleImageButtonDefaultConfig;