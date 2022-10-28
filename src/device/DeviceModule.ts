import { DeviceTools, getInstance, serviceLocatorAdd } from "@flashist/flibs";

import { BaseAppModule } from "../base/modules/BaseAppModule";
import { DeviceInfoModel } from "./models/DeviceInfoModel";

export class DeviceModule extends BaseAppModule {

    init(): void {
        super.init();

        // Modules
        serviceLocatorAdd(DeviceInfoModel, { isSingleton: true });
    }

    activateCompleteHook(): void {
        super.activateCompleteHook();

        const soundsStorageModule: DeviceInfoModel = getInstance(DeviceInfoModel);
        soundsStorageModule.deviceInfo = DeviceTools.getDeviceInfo();
    }
}