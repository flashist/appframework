import { getInstance } from "@flashist/flibs";

import { BaseAppManager } from "../../base/managers/BaseAppManager";
import { LocalStorageManager } from "../../local-storage/managers/LocalStorageManager";
import { appStorage } from "../../state/AppStateModule";
import { DeepReadonly } from "../../state/data/DeepReadableTypings";
import { AppSettings } from "../AppSettings";
import { IAppModelStorageVO } from "../data/local-storage/IAppModelStorageVO";
import { AppModuleState } from "../data/state/AppModuleState";

export class AppManager extends BaseAppManager {

    protected appState: DeepReadonly<AppModuleState>;
    protected storageManager: LocalStorageManager;

    protected updateTimeInterval: any;

    protected construction(...args): void {
        super.construction(args);

        this.storageManager = getInstance(LocalStorageManager);

        this.appState = appStorage().getState<AppModuleState>();
        const appModelStorageData: IAppModelStorageVO = this.storageManager.getParam<IAppModelStorageVO>(AppSettings.storageParamId);
        this.applyStorageData(appModelStorageData);

        // this.appState.app.previousSessionTotalUsageTime = this.appState.app.totalUsageDuration;
        // this.appState.app.sessionStartTime = Date.now();
        // // Increase app launch counter
        // this.appState.app.appLaunchesCount++;
        appStorage().change<AppModuleState>()(
            "app",
            {
                previousSessionTotalUsageTime: this.appState.app.totalUsageDuration,
                sessionStartTime: Date.now(),
                appLaunchesCount: this.appState.app.appLaunchesCount + 1
            }
        );

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
        let sessionTimeDelta: number = Date.now() - this.appState.app.sessionStartTime;

        // this.appState.app.totalUsageDuration = this.appState.app.previousSessionTotalUsageTime + sessionTimeDelta;
        appStorage().change<AppModuleState>()(
            "app",
            {
                totalUsageDuration: this.appState.app.previousSessionTotalUsageTime + sessionTimeDelta
            }
        );

        this.updateStorageData();
    }

    protected applyStorageData(data: IAppModelStorageVO): void {
        if (!data) {
            return;
        }

        // this.appState.app.appLaunchesCount = data.appLaunchesCount;
        // this.appState.app.totalUsageDuration = data.totalUsageTime;
        appStorage().change<AppModuleState>()(
            "app",
            {
                appLaunchesCount: data.appLaunchesCount,
                totalUsageDuration: data.totalUsageTime
            }
        );
    }

    protected updateStorageData(): void {
        const storageData: IAppModelStorageVO = this.generateStorageData();
        this.storageManager.setParam<IAppModelStorageVO>(AppSettings.storageParamId, storageData);
    }

    protected generateStorageData(): IAppModelStorageVO {
        return {
            appLaunchesCount: this.appState.app.appLaunchesCount,
            totalUsageTime: this.appState.app.totalUsageDuration
        };
    }
}