import { AppStateDeepKeyTools } from "./AppStateDeepKeyTools";
import { IDeepKeyHelperVO } from "./INestedPathHelperVO";

export class AppStateEventChangeTools {
    // static getAppStateChangeEventName(deepKey: string): string {
    //     return AppStateEventChangeTools.getChangeEvent(deepKey);
    // }

    static getChangeEvent(path: string | number | symbol): string {
        return `appStateChange:${path.toString()}`;
    }
}