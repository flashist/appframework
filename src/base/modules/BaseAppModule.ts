import {BaseObject} from "@flashist/fcore";

export abstract class BaseAppModule extends BaseObject {

    init(): void {
        // Should be overridden in subclasses, if needed
    }

    initCompleteHook(): void {
        // Should be overridden in subclasses, if needed
    }
    
    activateCompleteHook(): void {
        // Should be overridden in subclasses, if needed
    }

}