import { Ticker } from "pixi.js";

import { BaseAppManager } from "../../base/managers/BaseAppManager";
import { AppStateStorage } from "../../state/data/AppStateStorage";
import { appStorage } from "../../state/AppStateModule";
import { TimeModuleAppStateType } from "../data/state/TimeModuleAppStateType";


export class TimeManager extends BaseAppManager {

    protected appStateStorage: AppStateStorage = appStorage();

    protected addListeners(): void {
        super.addListeners();

        //this is the same PIXI's ticker as it uses for its purposes (like MovieClips atc)
        Ticker.shared.add(this.onTick, this);
    }

    protected removeListeners(): void {
        super.removeListeners();

        Ticker.shared.remove(this.onTick, this);
    }

    protected onTick(deltaTime: number): void {
        this.appStateStorage.change<TimeModuleAppStateType>()(
            "timeModule.curTime",
            Date.now()
        );

        this.appStateStorage.change<TimeModuleAppStateType>()(
            "timeModule.lastDeltaTime",
            deltaTime
        );
    }
}