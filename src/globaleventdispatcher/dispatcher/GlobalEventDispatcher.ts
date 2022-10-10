import {BaseObject, IEventListenerCallback} from "@flashist/fcore";

import {GlobalEventDispatcherEvent} from "./GlobalEventDispatcherEvent";

export class GlobalEventDispatcher extends BaseObject {

    dispatchEvent(type: string, ...args): void {
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

    public addPreEventListener(type: string, listener: IEventListenerCallback): void {
        this.addEventListener(
            this.getModifiedEventType(type, GlobalEventDispatcherEvent.PRE_DISPATCH_EVENT),
            listener
        );
    }

    public addPostEventListener(type: string, listener: IEventListenerCallback): void {
        this.addEventListener(
            this.getModifiedEventType(type, GlobalEventDispatcherEvent.POST_DISPATCH_EVENT),
            listener
        );
    }

    public removePreEventListener(type: string, listener: IEventListenerCallback): void {
        this.removeEventListener(
            this.getModifiedEventType(type, GlobalEventDispatcherEvent.PRE_DISPATCH_EVENT),
            listener
        );
    }

    public removePostEventListener(type: string, listener: IEventListenerCallback): void {
        this.removeEventListener(
            this.getModifiedEventType(type, GlobalEventDispatcherEvent.POST_DISPATCH_EVENT),
            listener
        );
    }

    protected getModifiedEventType(type: string, preText: string): string {
        return preText + type;
    }
}