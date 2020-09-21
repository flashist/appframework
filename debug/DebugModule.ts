import {Logger, ConsoleCustomLoggerItem} from "@flashist/fcore";
import {FApp} from "@flashist/flibs";
import {FC} from "@flashist/fconsole";

import {BaseModule} from "../base/modules/BaseModule";

export class DebugModule extends BaseModule {
    activateCompleteHook(): void {
        super.activateCompleteHook();

        FC.startInit(
            FApp.instance.stage,
            {
                console: {
                    defaultVisible: false
                }
            }
        );

        Logger.addLoggerItem(new ConsoleCustomLoggerItem());
    }
}