import { getInstance, SoundsManager } from "@flashist/flibs";

import { BaseAppManager } from "../../base/managers/BaseAppManager";
import { HTMLManagerEvent } from "./HTMLManagerEvent";

export class HTMLManager extends BaseAppManager {

    protected soundsManager: SoundsManager = getInstance(SoundsManager);

    protected isFirstClickComplete: boolean = false;

    protected blurLocker: any = { id: "HTMLManager.blurLocker" };
    protected visibilityLocker: any = { id: "HTMLManager.visibilityLocker" };

    protected documentHiddenPropertyName: string;

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

        // this.eventListenerHelper.addEventListener(
        //     document,
        //     "visibilitychange",
        //     this.onVisibilityChange
        // );

        //
        if (document.hidden !== false) {
            this.documentHiddenPropertyName = "hidden";
        } else if ((document as any).mozHidden !== false) {
            this.documentHiddenPropertyName = "mozHidden";
        } else if ((document as any).msHidden !== false) {
            this.documentHiddenPropertyName = "msHidden";
        } else if ((document as any).webkitHidden !== false) {
            this.documentHiddenPropertyName = "webkitHidden";
        }
        //
        const visibilityChangeEventNames = ["visibilitychange", "mozvisibilitychange", "msvisibilitychange", "webkitvisibilitychange", "qbrowserVisibilityChange"];
        // for (, o = 0; o < s.length; o++) {
        for (let singleVisibilityChangeEventName of visibilityChangeEventNames) {
            this.eventListenerHelper.addEventListener(
                document,
                singleVisibilityChangeEventName,
                this.onVisibilityChange
            );
        }
    }

    protected onInteraction(): void {
        if (this.isFirstClickComplete) {
            return;
        }
        this.isFirstClickComplete = true;

        this.soundsManager.activate();

        this.onFocus();
    }

    protected onVisibilityChange(event): void {
        console.log("HTML MANAGER | onVisibilityChange __ this.documentHiddenPropertyName: " + this.documentHiddenPropertyName
            , " | document[this.documentHiddenPropertyName]: ", document[this.documentHiddenPropertyName]
            , " | event.hidden: ", event.hidden
        );

        if (this.documentHiddenPropertyName) {
            if (document[this.documentHiddenPropertyName] || event.hidden) {
                this.soundsManager.addDisableLock(this.visibilityLocker);
                this.onBlur();

            } else {
                this.soundsManager.removeDisableLock(this.visibilityLocker);
                this.onFocus();
            };
        }
    }

    protected onFocus(event?: any): void {
        console.log("HTML MANAGER | onFocus");
        this.soundsManager.removeDisableLock(this.blurLocker);

        this.dispatchEvent(HTMLManagerEvent.FOCUS_RECEIVED);
    }

    protected onBlur(event?: any): void {
        console.log("HTML MANAGER | onBlur");
        this.soundsManager.addDisableLock(this.blurLocker);

        this.dispatchEvent(HTMLManagerEvent.FOCUS_LOST);
    }
}