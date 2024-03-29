import {Ticker} from "pixi.js";

import {getInstance} from "@flashist/flibs";

import {BaseAppManager} from "../../base/managers/BaseAppManager";
import {TimeModel} from "../models/TimeModel";


export class TimeManager extends BaseAppManager {

    protected timeModel: TimeModel = getInstance(TimeModel);

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
        this.timeModel.changeTimeData(Date.now(), deltaTime);
    }
}