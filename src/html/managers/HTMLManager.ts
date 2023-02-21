import { getInstance, SoundsManager } from "@flashist/flibs";

import { BaseAppManager } from "../../base/managers/BaseAppManager";

export class HTMLManager extends BaseAppManager {

    protected soundsManager: SoundsManager= getInstance(SoundsManager);

    protected isFirstClickComplete: boolean = false;

    protected blurLocker: any = {id: "HTMLManager.blurLocker"};
    protected visibilityLocker: any = {id:"HTMLManager.visibilityLocker"};

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

        this.soundsManager.activate();
    }

    protected onVisibilityChange(): void {
        // if (document.visibilityState === "visible") {
        //     this.soundsManager.removeDisableLock(this.visibilityLocker);
        //
        // } else {
        //     this.soundsManager.addDisableLock(this.visibilityLocker);
        // }
    }

    protected onFocus(): void {
        this.soundsManager.removeDisableLock(this.blurLocker);
    }

    protected onBlur(): void {
        this.soundsManager.addDisableLock(this.blurLocker);
    }
}