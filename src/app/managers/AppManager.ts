import * as dayjs from 'dayjs'

import { getInstance } from "@flashist/flibs";

import { BaseAppManager } from "../../base/managers/BaseAppManager";
import { LocalStorageManager } from "../../local-storage/managers/LocalStorageManager";
import { appStateStorage } from "../../state/AppStateModule";
import { DeepReadonly } from "../../state/data/DeepReadableTypings";
import { AppSettings } from "../AppSettings";
import { IAppModelLocalStorageVO } from "../data/local-storage/IAppModelLocalStorageVO";
import { AppModuleState } from "../data/state/AppModuleState";

export class AppManager extends BaseAppManager {

    protected appState: DeepReadonly<AppModuleState>;
    protected storageManager: LocalStorageManager;

    protected updateStorageInterval: any;
    protected updateTimeInterval: any;

    protected construction(...args): void {
        super.construction(args);

        this.storageManager = getInstance(LocalStorageManager);

        this.appState = appStateStorage().getState<AppModuleState>();
        const appModelStorageData: IAppModelLocalStorageVO = this.storageManager.getParam<IAppModelLocalStorageVO>(AppSettings.storageParamId);
        this.applyStorageData(appModelStorageData);

        // this.appState.app.previousSessionTotalUsageTime = this.appState.app.totalUsageDuration;
        // this.appState.app.sessionStartTime = Date.now();
        // // Increase app launch counter
        // this.appState.app.appLaunchesCount++;
        let sessionStartTimeFirstValue: number = Date.now();
        // If there is globally defined flashist-vars
        // and there is information about the time of openning of the app,
        // then use it
        if (flashistGlobalVars?.openTime) {
            sessionStartTimeFirstValue = flashistGlobalVars?.openTime;
        }
        appStateStorage().change<AppModuleState>()(
            "app",
            {
                prevSessionTotalUsageTime: this.appState.app.totalUsageDuration,
                sessionStartTime: sessionStartTimeFirstValue,
                appLaunchesCount: this.appState.app.appLaunchesCount + 1
            }
        );

        // Days Launches
        let curDate = new Date();
        let curDateTimestamp = curDate.getTime();
        //
        if (this.appState.app.prevLaunchTimestamp) {
            let prevDate = new Date(this.appState.app.prevLaunchTimestamp);

            let dayjs_curDate = dayjs(curDateTimestamp);
            let dayjs_prevDate = dayjs(prevDate.getTime());
            //
            let dayjs_daysDiff = dayjs_curDate.diff(prevDate, "d");
            console.log("dayjs_daysDiff: ", dayjs_daysDiff);
        }

        this.updateUsageTime();
        this.updateTimeInterval = setInterval(
            () => {
                this.updateUsageTime();
            },
            // 60 times per second
            1000 / 60
        );

        this.updateStorageData();
        this.updateStorageInterval = setInterval(
            () => {
                this.updateStorageData();
            },
            // 1 min
            1000 * 60
        );
    }

    protected updateUsageTime(): void {
        let sessionTimeDelta: number = Date.now() - this.appState.app.sessionStartTime;

        // this.appState.app.totalUsageDuration = this.appState.app.previousSessionTotalUsageTime + sessionTimeDelta;
        appStateStorage().change<AppModuleState>()(
            "app",
            {
                sessionDuration: sessionTimeDelta,
                totalUsageDuration: this.appState.app.prevSessionTotalUsageTime + sessionTimeDelta
            }
        );

        this.updateStorageData();
    }

    protected applyStorageData(data: IAppModelLocalStorageVO): void {
        if (!data) {
            return;
        }

        // this.appState.app.appLaunchesCount = data.appLaunchesCount;
        // this.appState.app.totalUsageDuration = data.totalUsageTime;
        appStateStorage().change<AppModuleState>()(
            "app",
            {
                appLaunchesCount: data.appLaunchesCount,
                totalUsageDuration: data.totalUsageTime
            }
        );
    }

    protected updateStorageData(): void {
        const storageData: IAppModelLocalStorageVO = this.generateStorageData();
        this.storageManager.setParam<IAppModelLocalStorageVO>(AppSettings.storageParamId, storageData);
    }

    protected generateStorageData(): IAppModelLocalStorageVO {
        return {
            appLaunchesCount: this.appState.app.appLaunchesCount,
            totalUsageTime: this.appState.app.totalUsageDuration
        };
    }
}