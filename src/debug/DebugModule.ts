import {ConsoleCustomLoggerItem, Logger} from "@flashist/fcore";
import {FApp} from "@flashist/flibs";
import {FC} from "@flashist/fconsole";

import {BaseAppModule} from "../base/modules/BaseAppModule";

export class DebugModule extends BaseAppModule {
    activateCompleteHook(): void {
        super.activateCompleteHook();

        FC.startInit(
            FApp.instance.stage,
            {
                console: {
                    defaultVisible: true
                }
            }
        );

        Logger.addLoggerItem(new ConsoleCustomLoggerItem());
    }
}