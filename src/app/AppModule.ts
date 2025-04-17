import { ObjectTools } from '@flashist/fcore';
import { serviceLocatorAdd } from "@flashist/flibs";

import { BaseAppModule } from "../base/modules/BaseAppModule";
import { appStateStorage } from "../state/AppStateModule";
import { AppModuleInitialState, AppModuleState } from './data/state/AppModuleState';
import { AppManager } from "./managers/AppManager";

export class AppModule extends BaseAppModule {

    constructor(protected debug: boolean) {
        super();
    }

    init(): void {
        super.init();

        // Init the app with initial state
        const initState: AppModuleState = ObjectTools.clone(AppModuleInitialState);
        ObjectTools.copyProps(initState, { app: { debug: this.debug } })
        //
        appStateStorage().initializeWith(initState);

        serviceLocatorAdd(AppManager, { isSingleton: true, forceCreation: true });
    }
}