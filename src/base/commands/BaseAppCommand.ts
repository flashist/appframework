import {Command} from "@flashist/fcore";
import {GlobalEventDispatcher} from "../../globaleventdispatcher/dispatcher/GlobalEventDispatcher";
import {getInstance} from "@flashist/flibs";

export abstract class BaseAppCommand<ResolveType = any> extends Command<ResolveType> {

    protected globalDispatcher: GlobalEventDispatcher;

    protected construction(...args): void {
        super.construction(...args);

        this.globalDispatcher = getInstance(GlobalEventDispatcher);
    }

    dispatchEvent(event: string, ...args: any[]): void {
        super.dispatchEvent(event, ...args);

        // Redispatch event to the global level
        this.globalDispatcher.dispatchEvent(event, ...args);
    }

}