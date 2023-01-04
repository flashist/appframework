import { serviceLocatorAdd } from "@flashist/flibs";

import { BaseAppModule } from "../base/modules/BaseAppModule";
import { AppManager } from "./managers/AppManager";
import { AppModuleInitialState } from "./data/state/AppModuleState";
import { appStorage } from "../state/AppStateModule";

export class AppModule extends BaseAppModule {

    constructor(protected debug: boolean) {
        super();
    }

    init(): void {
        super.init();

        // Init the app with initial state
        appStorage().initializeWith({
            ...AppModuleInitialState,
            debug: this.debug
        });

        serviceLocatorAdd(AppManager, { isSingleton: true, forceCreation: true });
    }
}