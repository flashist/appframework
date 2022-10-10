import {BaseAppGenericObjectsModel} from "../../base/models/BaseAppGenericObjectsModel";

export class AppModel extends BaseAppGenericObjectsModel {

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