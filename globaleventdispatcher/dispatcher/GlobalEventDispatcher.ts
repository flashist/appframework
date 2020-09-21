import {IEventListenerCallback, StringTools, BaseObject} from "@flashist/fcore";

import {GLobalEventDispatcherEvent} from "./GlobalEventDispatcherEvent";

export class GlobalEventDispatcher extends BaseObject {

    dispatchEvent(type: string, ...args): void {
        super.dispatchEvent(
            this.getModifiedEventType(type, GLobalEventDispatcherEvent.PRE_DISPATCH_EVENT),
            ...args
        );

        super.dispatchEvent(type, ...args);

        //
        super.dispatchEvent(
            this.getModifiedEventType(type, GLobalEventDispatcherEvent.POST_DISPATCH_EVENT),
            ...args
        );
    }

    addPreEventListener(type: string, listener: IEventListenerCallback): void {
        this.addEventListener(
            this.getModifiedEventType(type, GLobalEventDispatcherEvent.PRE_DISPATCH_EVENT),
            listener
        );
    }

    addPostEventListener(type: string, listener: IEventListenerCallback): void {
        this.addEventListener(
            this.getModifiedEventType(type, GLobalEventDispatcherEvent.POST_DISPATCH_EVENT),
            listener
        );
    }

    removePreEventListener(type: string, listener: IEventListenerCallback): void {
        this.removeEventListener(
            this.getModifiedEventType(type, GLobalEventDispatcherEvent.PRE_DISPATCH_EVENT),
            listener
        );
    }

    removePostEventListener(type: string, listener: IEventListenerCallback): void {
        this.removeEventListener(
            this.getModifiedEventType(type, GLobalEventDispatcherEvent.POST_DISPATCH_EVENT),
            listener
        );
    }

    protected getModifiedEventType(type: string, preText: string): string {
        return preText + type;
    }
}