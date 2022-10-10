import {getInstance, serviceLocatorAdd, SoundsManager} from "@flashist/flibs";

import {BaseAppModule} from "../base/modules/BaseAppModule";
import {BackgroundMusicManager} from "./managers/BackgroundMusicManager";
import {SoundsStorageManager} from "./managers/SoundsStorageManager";

export class SoundsModule extends BaseAppModule {

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