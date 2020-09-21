import {
    serviceLocatorAdd,
    SoundsManager,
    getInstance
} from "@flashist/flibs";

import {BaseModule} from "../base/modules/BaseModule";
import {BackgroundMusicManager} from "./managers/BackgroundMusicManager";
import {SoundsStorageManager} from "./managers/SoundsStorageManager";

export class SoundsModule extends BaseModule {

    init(): void {
        super.init();

        // Load
        serviceLocatorAdd(SoundsManager, {isSingleton: true});
        serviceLocatorAdd(BackgroundMusicManager, {isSingleton: true});
        serviceLocatorAdd(SoundsStorageManager, {isSingleton: true, forceCreation: true});
    }

    activateCompleteHook(): void {
        super.activateCompleteHook();

        const soundsStorageModule: SoundsStorageManager = getInstance(SoundsStorageManager);
        soundsStorageModule.activateCompleteHook();
    }
}