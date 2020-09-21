import {IActivatee} from "@flashist/flibs";

import {BaseObjectWithGlobalDispatcher} from "../BaseObjectWithGlobalDispatcher";

export class BaseMediator<ActivatorType = any> extends BaseObjectWithGlobalDispatcher implements IActivatee {
    protected activator: ActivatorType;

    onActivatorStart(activator: ActivatorType): void {
        this.activator = activator;
    }

    onActivatorEnd(): void {
        this.destruction();
    }
}