import { getInstance, serviceLocatorAdd, SoundsManager, SoundsManagerEvent } from "@flashist/flibs";

import { BaseAppModule } from "../base/modules/BaseAppModule";
import { BackgroundMusicManager } from "./managers/BackgroundMusicManager";
import { SoundsStorageManager } from "./managers/SoundsStorageManager";
import { GlobalEventDispatcher } from "../globaleventdispatcher";

export class SoundsModule extends BaseAppModule {

    init(): void {
        super.init();

        // Load
        serviceLocatorAdd(SoundsManager, { isSingleton: true });
        serviceLocatorAdd(BackgroundMusicManager, { isSingleton: true });
        serviceLocatorAdd(SoundsStorageManager, { isSingleton: true, forceCreation: true });
    }

    activateCompleteHook(): void {
        super.activateCompleteHook();

        const soundsStorageModule: SoundsStorageManager = getInstance(SoundsStorageManager);
        soundsStorageModule.activateCompleteHook();

        // Redispatch all events from the SoundsManager to the global dispatcher
        const globalDispatcher: GlobalEventDispatcher = getInstance(GlobalEventDispatcher);
        const soundsManager: SoundsManager = getInstance(SoundsManager);
        const allEventKeys: string[] = Object.keys(SoundsManagerEvent);
        for (let singleEventKey of allEventKeys) {
            const singleEventValue: string = SoundsManagerEvent[singleEventKey];
            this.eventListenerHelper.addEventListener(
                soundsManager,
                singleEventValue,
                (...args) => {
                    globalDispatcher.dispatchEvent(singleEventValue, ...args);
                }
            )
        }
    }
}