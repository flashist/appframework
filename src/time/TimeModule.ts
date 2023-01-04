import { serviceLocatorAdd } from "@flashist/flibs";

import { BaseAppModule } from "../base/modules/BaseAppModule";
import { appStorage } from "../state/AppStateModule";
import { TimeModuleInitialAppState } from "./data/state/TimeModuleAppStateType";
import { TimeManager } from "./managers/TimeManager";

export class TimeModule extends BaseAppModule {

    init(): void {
        super.init();

        // Init the app with initial state
        appStorage().initializeWith(TimeModuleInitialAppState);

        // serviceLocatorAdd(TimeModel, {isSingleton: true, forceCreation: true});
        serviceLocatorAdd(TimeManager, { isSingleton: true, forceCreation: true });
    }

}