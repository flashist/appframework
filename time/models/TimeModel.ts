import {BaseModel} from "../../base/models/BaseModel";
import {TimeModelEvent} from "./TimeModelEvent";

export class TimeModel extends BaseModel {

    public startTime: number = 0;
    public prevTime: number = 0;
    public currentTime: number = 0;
    public lastRenderDeltaTime: number = 0;

    protected construction(...args): void {
        super.construction(args);

        this.startTime = Date.now();
    }

    public changeTimeData(currentTime: number, lastRenderDeltaTime: number): void {
        this.prevTime = this.currentTime;
        this.currentTime = currentTime;

        this.lastRenderDeltaTime = lastRenderDeltaTime;

        this.dispatchEvent(TimeModelEvent.TIME_DATA_CHANGE);
    }

    public get timeDelta(): number {
        return this.currentTime - this.prevTime;
    }
}