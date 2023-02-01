export enum SimpleImageButtonState {
    NORMAL = "normal",
    OVER = "over",
    PRESS = "press",
    DISABLED = "disabled",

    SELECTED_NORMAL = "selected_normal",
    SELECTED_OVER = "selected_over",
    SELECTED_PRESS = "selected_press",
    SELECTED_DISABLED = "selected_disabled"
};

export const SimpleImageButtonStateNormalToSelectedMap = {
    [SimpleImageButtonState.NORMAL]: SimpleImageButtonState.SELECTED_NORMAL,
    [SimpleImageButtonState.OVER]: SimpleImageButtonState.SELECTED_OVER,
    [SimpleImageButtonState.PRESS]: SimpleImageButtonState.SELECTED_PRESS,
    [SimpleImageButtonState.DISABLED]: SimpleImageButtonState.SELECTED_DISABLED
};

export const SimpleImageButtonStateSelectedToNormalMap = {
    [SimpleImageButtonState.SELECTED_NORMAL]: SimpleImageButtonState.NORMAL,
    [SimpleImageButtonState.SELECTED_OVER]: SimpleImageButtonState.OVER,
    [SimpleImageButtonState.SELECTED_PRESS]: SimpleImageButtonState.PRESS,
    [SimpleImageButtonState.SELECTED_DISABLED]: SimpleImageButtonState.DISABLED
};

// export class SimpleButtonState {
//     public static NORMAL:string = "normal";
//     public static OVER:string = "over";
//     public static PRESS:string = "press";
//     public static DISABLED:string = "disabled";
//
//     public static SELECTED_NORMAL:string = "selected_normal";
//     public static SELECTED_OVER:string = "selected_over";
//     public static SELECTED_PRESS:string = "selected_press";
//     public static SELECTED_DISABLED:string = "selected_disabled";
//
//     public static NORMAL_TO_SELECTED_MAP = ((): any => {
//         let result = {};
//         result[SimpleButtonState.NORMAL] = SimpleButtonState.SELECTED_NORMAL;
//         result[SimpleButtonState.OVER] = SimpleButtonState.SELECTED_OVER;
//         result[SimpleButtonState.PRESS] = SimpleButtonState.SELECTED_PRESS;
//         result[SimpleButtonState.DISABLED] = SimpleButtonState.SELECTED_DISABLED;
//
//         return result;
//     })();
//
//     public static SELECTED_TO_NORMAL_MAP = ((): any => {
//         let result = {};
//         result[SimpleButtonState.SELECTED_NORMAL] = SimpleButtonState.NORMAL;
//         result[SimpleButtonState.SELECTED_OVER] = SimpleButtonState.OVER;
//         result[SimpleButtonState.SELECTED_PRESS] = SimpleButtonState.PRESS;
//         result[SimpleButtonState.SELECTED_DISABLED] = SimpleButtonState.DISABLED;
//
//         return result;
//     })();
// }