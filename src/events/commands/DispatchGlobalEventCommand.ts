import {Command} from "@flashist/fcore";
import {getInstance} from "@flashist/flibs";

import {GlobalEventDispatcher} from "../../globaleventdispatcher/dispatcher/GlobalEventDispatcher";

export class DispatchGlobalEventCommand extends Command {

    protected globalDispatcher: GlobalEventDispatcher;
    protected event: string;

    constructor(event: string) {
        super();

        this.event = event;
        this.globalDispatcher = getInstance(GlobalEventDispatcher);
    }

    protected executeInternal(): void {
        this.globalDispatcher.dispatchEvent(this.event);
        this.notifyComplete();
    }
}