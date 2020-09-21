import {BaseModel} from "../../base/models/BaseModel";

export class AppModel extends BaseModel {

    public appLaunchesCount: number;
    public totalUsageDuration: number;

    public sessionStartTime: number;
    public previousSessionTotalUsageTime: number;

    protected construction(...args): void {
        super.construction(args);

        this.appLaunchesCount = 0;
        this.totalUsageDuration = 0;
    }

}