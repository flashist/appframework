import { DeviceTools, getInstance, serviceLocatorAdd } from "@flashist/flibs";

import { BaseAppModule } from "../base/modules/BaseAppModule";
import { appStorage } from "../state/AppStateModule";
import { DeviceModuleInitialState } from "./data/state/DeviceModuleState";

export class DeviceModule extends BaseAppModule {

    init(): void {
        super.init();

        appStorage().initializeWith(DeviceModuleInitialState);

        // Modules
        // serviceLocatorAdd(DeviceInfoModel, { isSingleton: true });
    }
}