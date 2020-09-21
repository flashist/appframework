import {getInstance} from "@flashist/flibs";

import {BaseManager} from "../../base/managers/BaseManager";
import {AppModel} from "../models/AppModel";
import {StorageManager} from "../../storage/managers/StorageManager";
import {AppSettings} from "../AppSettings";
import {IAppModelStorageVO} from "../data/IAppModelStorageVO";

export class AppManager extends BaseManager {

    protected appModel: AppModel;
    protected storageManager: StorageManager;

    protected updateTimeInterval: any;

    protected construction(...args): void {
        super.construction(args);

        this.appModel = getInstance(AppModel);
        this.storageManager = getInstance(StorageManager);

        const appModelStorageData: IAppModelStorageVO = this.storageManager.getParam<IAppModelStorageVO>(AppSettings.storageParamId);
        this.applyStorageData(appModelStorageData);

        this.appModel.previousSessionTotalUsageTime = this.appModel.totalUsageDuration;
        this.appModel.sessionStartTime = Date.now();

        // Increase app launch counter
        this.appModel.appLaunchesCount++;

        this.updateStorageData();
        this.updateTimeInterval = setInterval(
            () => {
                this.updateUsageTime();
            },
            // 1 min
            1000 * 60
        );
    }

    protected updateUsageTime(): void {
        let sessionTimeDelta: number = Date.now() - this.appModel.sessionStartTime;
        this.appModel.totalUsageDuration = this.appModel.previousSessionTotalUsageTime + sessionTimeDelta;

        this.updateStorageData();
    }

    protected applyStorageData(data: IAppModelStorageVO): void {
        if (!data) {
            return;
        }

        this.appModel.appLaunchesCount = data.appLaunchesCount;
        this.appModel.totalUsageDuration = data.totalUsageTime;
    }

    protected updateStorageData(): void {
        const storageData: IAppModelStorageVO = this.generateStorageData();
        this.storageManager.setParam<IAppModelStorageVO>(AppSettings.storageParamId, storageData);
    }

    protected generateStorageData(): IAppModelStorageVO {
        return {
            appLaunchesCount: this.appModel.appLaunchesCount,
            totalUsageTime: this.appModel.totalUsageDuration
        };
    }
}