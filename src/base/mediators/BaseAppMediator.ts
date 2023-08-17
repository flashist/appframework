import { IDefaultEventDispatcher, IEventListener } from "@flashist/fcore";
import { IActivatee } from "@flashist/flibs";

import { BaseObjectWithGlobalDispatcher } from "../BaseObjectWithGlobalDispatcher";

export class BaseAppMediator<ActivatorType extends IDefaultEventDispatcher<any> = IDefaultEventDispatcher<any>> extends BaseObjectWithGlobalDispatcher implements IActivatee {
    protected activator: ActivatorType;

    onActivatorStart(activator: ActivatorType): void {
        this.activator = activator;
    }

    onActivatorEnd(): void {
        this.destruction();
    }

    public addActivatorListener(type: string, listener: IEventListener): void {
        this.eventListenerHelper.addEventListener(
            this.activator,
            type,
            listener
        )
    }
}