import { getInstance } from "@flashist/flibs";

import { BaseAppManager } from "../../base/managers/BaseAppManager";
import { LocalStorageManager } from "../../local-storage/managers/LocalStorageManager";
import { appStateStorage } from "../../state/AppStateModule";
import { DeepReadonly } from "../../state/data/DeepReadableTypings";
import { AppSettings } from "../AppSettings";
import { IAppModelLocalStorageVO } from "../data/local-storage/IAppModelLocalStorageVO";
import { AppModuleState } from "../data/state/AppModuleState";
import { DateSettings } from "../../date/DateSettings";
import { NumberTools } from "@flashist/fcore";

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

        // Make sure the prev session start time is updated
        appStateStorage().change<AppModuleState>()(
            "app",
            {
                prevLaunchTimestamp: this.appState.app.curLaunchTimestamp
            }
        );

        // // Increase app launch counter
        // this.appState.app.appLaunchesCount++;
        let curLaunchStartTimeFirstValue: number = Date.now();
        // If there is globally defined flashist-vars
        // and there is information about the time of openning of the app,
        // then use it
        if (flashistGlobalVars?.openTime) {
            curLaunchStartTimeFirstValue = flashistGlobalVars?.openTime;
        }
        appStateStorage().change<AppModuleState>()(
            "app",
            {
                prevSessionTotalUsageDuration: this.appState.app.totalUsageDuration,
                curLaunchTimestamp: curLaunchStartTimeFirstValue,
                appLaunchesCount: this.appState.app.appLaunchesCount + 1
            }
        );

        // Days Launches
        let curDateTimestamp: number = curLaunchStartTimeFirstValue;
        //
        if (this.appState.app.prevLaunchTimestamp) {

            let curPrevDaysNumberDelta: number = 0;
            //
            let curPrevDatesDelta: number = curDateTimestamp - this.appState.app.prevLaunchTimestamp;
            let fullDaysDelta: number = Math.floor(curPrevDatesDelta / DateSettings.MS_IN_DAY);
            let curPrevDatesDeltaLeftoverFromFullDay: number = curPrevDatesDelta % DateSettings.MS_IN_DAY;
            //
            curPrevDaysNumberDelta = fullDaysDelta;
            //
            // IMPORTANT: we can't use the prevLaunchTimestamp for calculating the leftover for the day,
            // because the timestamp from the date object has internal shift connected to the timezone.
            // But what we can do is to calculate the milliseconds that are left in a day manually
            // and then use this for further calculations.
            // let prevDateTimestampTillNextDay: number = this.appState.app.prevLaunchTimestamp % DateSettings.MS_IN_DAY;
            let tempPrevLaunchDate: Date = new Date(this.appState.app.prevLaunchTimestamp);
            let tempPrevLaunchDateMillisecondsInDay: number = (tempPrevLaunchDate.getHours() * 60 * 60 * 1000) + (tempPrevLaunchDate.getMinutes() * 60 * 1000) + (tempPrevLaunchDate.getSeconds() * 1000) + tempPrevLaunchDate.getMilliseconds()
            let prevDateTimestampTillNextDay: number = DateSettings.MS_IN_DAY - tempPrevLaunchDateMillisecondsInDay;
            // If the leftover from the cur-prev dates is equal or greater,
            // than the leftover 'till the next day for the prev date,
            // it means, that there is 1 additional day difference between the dates
            if (curPrevDatesDeltaLeftoverFromFullDay >= prevDateTimestampTillNextDay) {
                curPrevDaysNumberDelta += 1;
            }

            if (curPrevDaysNumberDelta > 0) {
                appStateStorage().change<AppModuleState>()(
                    "app",
                    {
                        appDaysLaunchesCount: this.appState.app.appDaysLaunchesCount + 1
                    }
                );
            }

            // Consequent days
            //
            // Day1
            let newStreakDay1: number = this.appState.app.appDaysLaunchesCount_consequent_withMaxBreaks_Day1;
            if (0 < fullDaysDelta && fullDaysDelta <= 1) {
                newStreakDay1 = this.appState.app.appDaysLaunchesCount_consequent_withMaxBreaks_Day1 + 1;
            } else if (fullDaysDelta > 1) {
                newStreakDay1 = 0;
            }
            //
            // Day3
            let newStreakDay3: number = this.appState.app.appDaysLaunchesCount_consequent_withMaxBreaks_Day3;
            if (0 < fullDaysDelta && fullDaysDelta <= 3) {
                newStreakDay3 = this.appState.app.appDaysLaunchesCount_consequent_withMaxBreaks_Day3 + 1;
            } else if (fullDaysDelta > 3) {
                newStreakDay3 = 0;
            }
            //
            // Day7
            let newStreakDay7: number = 0;
            if (0 < fullDaysDelta && fullDaysDelta <= 7) {
                newStreakDay7 = this.appState.app.appDaysLaunchesCount_consequent_withMaxBreaks_Day7 + 1;
            } else if (fullDaysDelta > 7) {
                newStreakDay7 = 0;
            }
            //
            appStateStorage().change<AppModuleState>()(
                "app",
                {
                    appDaysLaunchesCount_consequent_withMaxBreaks_Day1: newStreakDay1,
                    appDaysLaunchesCount_consequent_withMaxBreaks_Day3: newStreakDay3,
                    appDaysLaunchesCount_consequent_withMaxBreaks_Day7: newStreakDay7,
                }
            );
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
        let sessionTimeDelta: number = Date.now() - this.appState.app.curLaunchTimestamp;

        // this.appState.app.totalUsageDuration = this.appState.app.prevSessionTotalUsageDuration + sessionTimeDelta;
        appStateStorage().change<AppModuleState>()(
            "app",
            {
                sessionDuration: sessionTimeDelta,
                totalUsageDuration: this.appState.app.prevSessionTotalUsageDuration + sessionTimeDelta
            }
        );

        this.updateStorageData();
    }

    protected applyStorageData(data: IAppModelLocalStorageVO): void {
        if (!data) {
            return;
        }

        // this.appState.app.appLaunchesCount = data.appLaunchesCount;
        // this.appState.app.totalUsageDuration = data.totalUsageDuration;
        appStateStorage().change<AppModuleState>()(
            "app",
            {
                ...data
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
            totalUsageDuration: this.appState.app.totalUsageDuration,

            curLaunchTimestamp: this.appState.app.curLaunchTimestamp,
            prevLaunchTimestamp: this.appState.app.prevLaunchTimestamp,
            appDaysLaunchesCount: this.appState.app.appDaysLaunchesCount,
            appDaysLaunchesCount_consequent_withMaxBreaks_Day1: this.appState.app.appDaysLaunchesCount_consequent_withMaxBreaks_Day1,
            appDaysLaunchesCount_consequent_withMaxBreaks_Day3: this.appState.app.appDaysLaunchesCount_consequent_withMaxBreaks_Day3,
            appDaysLaunchesCount_consequent_withMaxBreaks_Day7: this.appState.app.appDaysLaunchesCount_consequent_withMaxBreaks_Day7
        };
    }
}