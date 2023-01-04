import { serviceLocatorAdd } from "@flashist/flibs";

import { BaseAppModule } from "../base/modules/BaseAppModule";
import { AppManager } from "./managers/AppManager";
import { AppModuleInitialState, AppModuleState } from './data/state/AppModuleState';
import { appStorage } from "../state/AppStateModule";
import { ObjectTools } from '../../../fcore/src/tools/ObjectTools';

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
        appStorage().initializeWith(initState);

        serviceLocatorAdd(AppManager, { isSingleton: true, forceCreation: true });
    }
}