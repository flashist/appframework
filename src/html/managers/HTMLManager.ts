import {getInstance, SoundsManager} from "@flashist/flibs";

import {BaseAppManager} from "../../base/managers/BaseAppManager";

export class HTMLManager extends BaseAppManager {

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