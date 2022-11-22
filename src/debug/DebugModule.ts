import { ConsoleCustomLoggerItem, Logger } from "@flashist/fcore";
import { FApp, getInstance, serviceLocatorAdd } from "@flashist/flibs";
import { FC } from "@flashist/fconsole";

import { BaseAppModule } from "../base/modules/BaseAppModule";
import { DefaultDebugModuleConfigVO } from "./data/DefaultDebugModuleConfigVO";
import { IDebugModuleConfigVO } from "./data/IDebugModuleConfigVO";

export class DebugModule extends BaseAppModule {

    init(): void {
        super.init();

        // Modules
        serviceLocatorAdd(DefaultDebugModuleConfigVO, { isSingleton: true });
    }

    activateCompleteHook(): void {
        super.activateCompleteHook();

        const fConsoleConfig: IDebugModuleConfigVO = getInstance(DefaultDebugModuleConfigVO);
        FC.startInit(
            FApp.instance.stage,
            fConsoleConfig.fconsoleConfig
        );

        Logger.addLoggerItem(new ConsoleCustomLoggerItem());
    }
}