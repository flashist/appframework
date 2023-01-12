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
        let timeDelta: number = newTime - this.timeModuleState.timeModule.curTime;
        if (this.timeModuleState.timeModule.minTimeDelta) {
            if (timeDelta < this.timeModuleState.timeModule.minTimeDelta) {
                timeDelta = this.timeModuleState.timeModule.minTimeDelta;
            }
        }
        if (this.timeModuleState.timeModule.maxTimeDelta) {
            if (timeDelta > this.timeModuleState.timeModule.maxTimeDelta) {
                timeDelta = this.timeModuleState.timeModule.maxTimeDelta;
            }
        }

        this.appStateStorage.change<TimeModuleAppState>()(
            "timeModule.curTime",
            newTime
        );

        this.appStateStorage.change<TimeModuleAppState>()(
            "timeModule.lastTimeDelta",
            timeDelta
        );

        this.dispatchEvent(TimeManagerEvent.UPDATE);
    }
}