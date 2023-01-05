import { ConsoleCustomLoggerItem, Logger } from "@flashist/fcore";
import { FApp, getInstance, serviceLocatorAdd } from "@flashist/flibs";
import { FC } from "@flashist/fconsole";

import { BaseAppModule } from "../base/modules/BaseAppModule";
import { appStorage } from "../state/AppStateModule";
import { DebugModuleInitialState, DebugModuleState } from "./data/state/DebugModuleState";
import { IFConsoleConfigVO } from "@flashist/fconsole/console/config/IFConsoleConfigVO";

export class DebugModule extends BaseAppModule {

    init(): void {
        super.init();

        appStorage().initializeWith(DebugModuleInitialState);

        // Modules
        // serviceLocatorAdd(DefaultDebugModuleConfigVO, { isSingleton: true });
    }

    activateCompleteHook(): void {
        super.activateCompleteHook();

        // const fConsoleConfig: IDebugModuleConfigVO = getInstance(DefaultDebugModuleConfigVO);
        const appState = appStorage().getState<DebugModuleState>()
        FC.startInit(
            FApp.instance.stage,
            appState.debug.fconsole as Partial<IFConsoleConfigVO>
        );

        Logger.addLoggerItem(new ConsoleCustomLoggerItem());
    }
}