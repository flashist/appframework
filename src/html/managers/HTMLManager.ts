import { getInstance, SoundsManager } from "@flashist/flibs";

import { BaseAppManager } from "../../base/managers/BaseAppManager";

export class HTMLManager extends BaseAppManager {

    protected soundsManager: SoundsManager;

    protected firstClickSoundLocker;
    protected isFirstClickComplete: boolean = false;

    protected construction(...args: any[]): void {
        super.construction(...args);

        this.soundsManager = getInstance(SoundsManager);

        // At the beginning set a lock to make sure nothing happens in audio before the 1st click
        this.firstClickSoundLocker = {};
        this.soundsManager.addDisableLock(this.firstClickSoundLocker);
    }

    protected addListeners(): void {
        super.addListeners();

        this.eventListenerHelper.addEventListener(
            document,
            "click",
            this.onInteraction
        );

        this.eventListenerHelper.addEventListener(
            document,
            "touchend",
            this.onInteraction
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

        this.eventListenerHelper.addEventListener(
            document,
            "visibilitychange",
            this.onVisibilityChange
        );
    }

    protected onInteraction(): void {
        if (this.isFirstClickComplete) {
            return;
        }
        this.isFirstClickComplete = true;

        this.soundsManager.removeDisableLock(this.firstClickSoundLocker);
    }

    protected onVisibilityChange(): void {
        if (document.visibilityState === "visible") {
            this.soundsManager.removeDisableLock(this);

        } else {
            this.soundsManager.addDisableLock(this);
        }
    }

    protected onFocus(): void {
        this.soundsManager.removeDisableLock(this);
    }

    protected onBlur(): void {
        this.soundsManager.addDisableLock(this);
    }
}