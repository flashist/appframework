import { IEventListener } from "@flashist/fcore";
import { getInstance } from "@flashist/flibs";

import { AppResizableContainer } from "../../display/views/resize/AppResizableContainer";
import { GlobalEventDispatcher } from "../../globaleventdispatcher/dispatcher/GlobalEventDispatcher";

export class BaseAppView<DataType extends object = object> extends AppResizableContainer<DataType> {

    protected globalDispatcher: GlobalEventDispatcher;

    protected construction(...args): void {
        super.construction(...args);

        this.globalDispatcher = getInstance(GlobalEventDispatcher);
    }

    protected addGlobalEventListener(event: string, fn: IEventListener): void {
        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            event,
            fn
        );
    }

}