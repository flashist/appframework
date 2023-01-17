import { getInstance, SoundsManager } from "@flashist/flibs";

import { BaseAppManager } from "../../base/managers/BaseAppManager";

export class HTMLManager extends BaseAppManager {

    protected soundsManager: SoundsManager;

    protected firstClickSoundLocker = {};
    protected isFirstClickComplete: boolean = false;

    protected construction(...args: any[]): void {
        super.construction(...args);

        this.soundsManager = getInstance(SoundsManager);

        // At the beginning set a lock to make sure nothing happens in audio before the 1st click
        this.soundsManager.addDisableLock(this.firstClickSoundLocker);
    }

    protected addListeners(): void {
        super.addListeners();

        this.eventListenerHelper.addEventListener(
            document,
            "click",
            () => {
                if (this.isFirstClickComplete) {
                    return;
                }
                this.isFirstClickComplete = true;

                this.soundsManager.removeDisableLock(this.firstClickSoundLocker);
            }
        );

        this.eventListenerHelper.addEventListener(
            window as any,
            "focus",
            this.onFocus
        );

        this.eventListenerHelper.addEventListener(
            window as any,
            "blur",
            this.onBlur
        );
    }

    protected onFocus(): void {
        this.soundsManager.removeDisableLock(this);
    }

    protected onBlur(): void {
        this.soundsManager.addDisableLock(this);
    }
}