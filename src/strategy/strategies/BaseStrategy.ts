import {ArrayTools, Logger} from "@flashist/fcore";
import {BaseObjectWithGlobalDispatcher} from "../../base/BaseObjectWithGlobalDispatcher";

export abstract class BaseStrategy extends BaseObjectWithGlobalDispatcher {

    protected static cache: BaseStrategy[] = [];

    activate(): void {
        Logger.log("BaseStrategy | activate __ this: ", this);

        if (BaseStrategy.cache.indexOf(this) == -1) {
            BaseStrategy.cache.push(this);
        }
    };

    deactivate(): void {
        this.eventListenerHelper.removeAllListeners();

        ArrayTools.removeItem(BaseStrategy.cache, this);
    }
}