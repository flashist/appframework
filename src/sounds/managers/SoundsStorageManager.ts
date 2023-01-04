import {BaseObject} from "@flashist/fcore";
import {getInstance, SoundsManager, SoundsManagerEvent} from "@flashist/flibs";

import {LocalStorageManager} from "../../local-storage/managers/LocalStorageManager";
import {SoundsSettings} from "../SoundsSettings";

export class SoundsStorageManager extends BaseObject {

    protected soundsManager: SoundsManager;
    protected storageManager: LocalStorageManager;

    protected construction(...args): void {
        this.soundsManager = getInstance(SoundsManager);
        this.storageManager = getInstance(LocalStorageManager);

        super.construction(...args);
    }

    protected addListeners(): void {
        super.addListeners();

        this.eventListenerHelper.addEventListener(
            this.soundsManager,
            SoundsManagerEvent.IS_MUTED_CHANGE,
            this.onSoundsDataChange
        );
    }

    protected onSoundsDataChange(): void {
        this.commitSoundsData();
    }

    public activateCompleteHook(): void {
        const isMuted: boolean = this.storageManager.getParam<boolean>(SoundsSettings.storage.isMutedParamId);
        if (isMuted === true || isMuted === false) {
            this.soundsManager.isMuted = isMuted;
        }

        this.commitSoundsData();
    }

    protected commitSoundsData(): void {
        this.storageManager.setParam(SoundsSettings.storage.isMutedParamId, this.soundsManager.isMuted);
    }
}