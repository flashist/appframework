import { BaseObject } from "@flashist/fcore";

export abstract class BaseAppModule extends BaseObject {

    init(): void {
        // Should be overridden in subclasses, if needed
    }

    preInitHook(): void | Promise<void> {
        // Should be overridden in subclasses, if needed
    }

    postInitHook(): void | Promise<void> {
        // Should be overridden in subclasses, if needed
    }

    postCompleteHook(): void | Promise<void> {
        // Should be overridden in subclasses, if needed
    }

}