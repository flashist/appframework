export class BaseBtnState {
    public static NORMAL:string = "normal";
    public static OVER:string = "over";
    public static PRESS:string = "press";
    public static DISABLED:string = "disabled";

    public static SELECTED_NORMAL:string = "selected_normal";
    public static SELECTED_OVER:string = "selected_over";
    public static SELECTED_PRESS:string = "selected_press";
    public static SELECTED_DISABLED:string = "selected_disabled";

    public static NORMAL_TO_SELECTED_MAP = ((): any => {
        let result: any = {};
        result[BaseBtnState.NORMAL] = BaseBtnState.SELECTED_NORMAL;
        result[BaseBtnState.OVER] = BaseBtnState.SELECTED_OVER;
        result[BaseBtnState.PRESS] = BaseBtnState.SELECTED_PRESS;
        result[BaseBtnState.DISABLED] = BaseBtnState.SELECTED_DISABLED;

        return result;
    })();

    public static SELECTED_TO_NORMAL_MAP = ((): any => {
        let result: any = {};
        result[BaseBtnState.SELECTED_NORMAL] = BaseBtnState.NORMAL;
        result[BaseBtnState.SELECTED_OVER] = BaseBtnState.OVER;
        result[BaseBtnState.SELECTED_PRESS] = BaseBtnState.PRESS;
        result[BaseBtnState.SELECTED_DISABLED] = BaseBtnState.DISABLED;

        return result;
    })();
}