import { Ticker } from "pixi.js";

import { BaseAppManager } from "../../base/managers/BaseAppManager";
import { AppStateStorage } from "../../state/data/AppStateStorage";
import { appStorage } from "../../state/AppStateModule";
import { TimeModuleAppState } from "../data/state/TimeModuleAppState";
import { TimeModule } from '../TimeModule';
import { TimeManagerEvent } from "./TimeManagerEvent";


export class TimeManager extends BaseAppManager {

    protected appStateStorage: AppStateStorage = appStorage();
    protected timeModuleState: TimeModuleAppState = appStorage().getState<TimeModuleAppState>();

    protected addListeners(): void {
        super.addListeners();

        //this is the same PIXI's ticker as it uses for its purposes (like MovieClips atc)
        Ticker.shared.add(this.onTick, this);
    }

    protected removeListeners(): void {
        super.removeListeners();

        Ticker.shared.remove(this.onTick, this);
    }

    protected onTick(): void {
        const newTime: number = Date.now();
        let timeDelta: number = newTime - this.timeModuleState.time.curTime;
        if (this.timeModuleState.time.minTimeDelta) {
            if (timeDelta < this.timeModuleState.time.minTimeDelta) {
                // timeDelta = this.timeModuleState.time.minTimeDelta;
                return;
            }
        }

        if (this.timeModuleState.time.maxTimeDelta) {
            if (timeDelta > this.timeModuleState.time.maxTimeDelta) {
                timeDelta = this.timeModuleState.time.maxTimeDelta;
            }
        }

        this.appStateStorage.change<TimeModuleAppState>()(
            "time.curTime",
            newTime
        );

        this.appStateStorage.change<TimeModuleAppState>()(
            "time.lastTimeDelta",
            timeDelta
        );

        this.appStateStorage.change<TimeModuleAppState>()(
            "time.lastTimeDeltaSec",
            timeDelta / 1000
        );

        this.dispatchEvent(TimeManagerEvent.UPDATE);
    }
}