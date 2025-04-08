import { serviceLocatorAdd } from "@flashist/flibs";

import { BaseAppModule } from "../base/modules/BaseAppModule";
import { appStateStorage } from "../state/AppStateModule";
import { TimeModuleInitialAppState } from "./data/state/TimeModuleAppState";
import { TimeManager } from "./managers/TimeManager";

export class TimeModule extends BaseAppModule {

    init(): void {
        super.init();

        // Init the app with initial state
        appStateStorage().initializeWith(TimeModuleInitialAppState);

        // serviceLocatorAdd(TimeModel, {isSingleton: true, forceCreation: true});
        serviceLocatorAdd(TimeManager, { isSingleton: true, forceCreation: true });
    }

}