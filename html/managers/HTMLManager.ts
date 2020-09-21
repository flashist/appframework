import {getInstance, SoundsManager} from "@flashist/flibs";

import {BaseManager} from "../../base/managers/BaseManager";

export class HTMLManager extends BaseManager {

    protected soundsManager: SoundsManager = getInstance(SoundsManager);

    protected addListeners(): void {
        super.addListeners();

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