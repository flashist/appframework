import {Dictionary, Command, IConstructor} from "@flashist/fcore";
import {getInstance} from "@flashist/flibs";

import {BaseAppManager} from "../../base/managers/BaseAppManager";

export class GlobalEventsCommandManager extends BaseAppManager {

    public bindCommand(event: string, CommandClass: IConstructor<Command<any | never>>, guard?: (...args: any) => boolean): void {
        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            event,
            (...args) => {
                // If there is no guard function, or if there is a guard function and the checking is passed,
                // then create command and execute it
                if (!guard || guard(...args)) {
                    getInstance(CommandClass, ...args)
                        .execute();
                }
            }
        );
    }

    // TODO: implement logic of REMOVING / UNBINDING commands from global events
    //  (should be possible to remove one binding without removing other,
    //  because one command might be binded to different events and to a single event, but with different guard methods)
}