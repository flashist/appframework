import { serviceLocatorAdd } from "@flashist/flibs";
import { BaseAppModule } from "../base/modules/BaseAppModule";
import { appStorage } from "../state/AppStateModule";
import { ECSModuleInitialState } from "./data/state/ECSModuleState";
import { ECSManager } from "./managers/ECSManager";

export class ECSModule extends BaseAppModule {

    init(): void {
        super.init();


        // Init the app with initial state
        appStorage().initializeWith(ECSModuleInitialState);

        serviceLocatorAdd(ECSManager, { isSingleton: true, forceCreation: true });
    }
}