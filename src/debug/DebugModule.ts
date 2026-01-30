import { ConsoleCustomLoggerItem, Logger } from "@flashist/fcore";
import { FApp, getInstance, serviceLocatorAdd } from "@flashist/flibs";
import { FC } from "@flashist/fconsole";

import { BaseAppModule } from "../base/modules/BaseAppModule";
import { appStateStorage } from "../state/AppStateModule";
import { DebugModuleInitialState, DebugModuleState } from "./data/state/DebugModuleState";
import { IFConsoleConfigVO } from "@flashist/fconsole/console/config/IFConsoleConfigVO";

export class DebugModule extends BaseAppModule {

    init(): void {
        super.init();

        appStateStorage().initializeWith(DebugModuleInitialState);

        // Modules
        // serviceLocatorAdd(DefaultDebugModuleConfigVO, { isSingleton: true });
    }

    postCompleteHook(): void {
        super.postCompleteHook();

        // const fConsoleConfig: IDebugModuleConfigVO = getInstance(DefaultDebugModuleConfigVO);
        const appState = appStateStorage().getState<DebugModuleState>()
        FC.startInit(
            FApp.instance.stage,
            appState.debug.fconsole as Partial<IFConsoleConfigVO>
        );

        Logger.addLoggerItem(new ConsoleCustomLoggerItem());
    }
}