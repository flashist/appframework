import { BaseObject, IEventListener } from "@flashist/fcore";

import { GlobalEventDispatcherEvent } from "./GlobalEventDispatcherEvent";
import { GlobalEventDispatcherAgumentsType } from "./GlobalEventDispatcherAgumentsType";

export class GlobalEventDispatcher extends BaseObject {

    dispatchEvent<ArgsType extends GlobalEventDispatcherAgumentsType = GlobalEventDispatcherAgumentsType>(type: string, ...args: ArgsType): void {
        super.dispatchEvent(
            this.getModifiedEventType(type, GlobalEventDispatcherEvent.PRE_DISPATCH_EVENT),
            ...args
        );

        super.dispatchEvent(type, ...args);

        //
        super.dispatchEvent(
            this.getModifiedEventType(type, GlobalEventDispatcherEvent.POST_DISPATCH_EVENT),
            ...args
        );
    }

    public addPreEventListener(type: string, listener: IEventListener): void {
        this.addEventListener(
            this.getModifiedEventType(type, GlobalEventDispatcherEvent.PRE_DISPATCH_EVENT),
            listener
        );
    }

    public addPostEventListener(type: string, listener: IEventListener): void {
        this.addEventListener(
            this.getModifiedEventType(type, GlobalEventDispatcherEvent.POST_DISPATCH_EVENT),
            listener
        );
    }

    public removePreEventListener(type: string, listener: IEventListener): void {
        this.removeEventListener(
            this.getModifiedEventType(type, GlobalEventDispatcherEvent.PRE_DISPATCH_EVENT),
            listener
        );
    }

    public removePostEventListener(type: string, listener: IEventListener): void {
        this.removeEventListener(
            this.getModifiedEventType(type, GlobalEventDispatcherEvent.POST_DISPATCH_EVENT),
            listener
        );
    }

    protected getModifiedEventType(type: string, preText: string): string {
        return preText + type;
    }
}