import { Rectangle } from "pixi.js";

export const AppModuleInitialState = {
    app: {
        debug: false,

        // The timestamp of the current launching date
        curLaunchStartTimestamp: 0,
        // curLaunchTimestamp: 0,
        // The last previous timestamp of the current launching date
        prevLaunchTimestamp: 0,

        appLaunchesCount: 0,

        // Total amount of separate days that the app was launched at
        appDaysLaunchesCount: 0,
        // Total amount of CONSEQUENT days that the app was launched,
        // without breaking the CONSEQUENT days counters.
        //
        // NOTES:
        // 1. If a counter is broken then a related counters goes to 0 again:
        // e.g. a person opens a game after 1 day of not playing it,
        // it will affect the the counter for the Day1,
        // but the Day3, Day7 counters won't be affected.
        //
        // 2. If a player opens the game 3 times every day,
        // then Day1, Day3, Day7 counters will show 7
        //
        // 3. If a player opens the game on Mon, Wed, Fr,
        // then the counters will be Day1 = 0, Day3 and Day7 = 2
        //
        // 4. If a player opens the game on Mon and Sat,
        // the counters will be Day1 and Day3 = 0, Day 7 = 1
        appDaysLaunchesCount_consequent_withMaxBreaks_Day1: 0,
        appDaysLaunchesCount_consequent_withMaxBreaks_Day3: 0,
        appDaysLaunchesCount_consequent_withMaxBreaks_Day7: 0,
        // // Total amount of CONSEQUENT days that the app was launched at,
        // // if the consequent streak is broken, starts from 1 again
        // appConsequentDaysLaunchesCount: 0,
        // // Total amount of CONSEQUENT days with max 3 Days Retention streak,
        // // if the streak is broken, starts from 1 again
        // appConsequentDay3RetentionLaunchesCount: 0,
        // // Total amount of CONSEQUENT days with max 7 Days Retention streak,
        // // if the streak is broken, starts from 1 again
        // appConsequentDay7RetentionLaunchesCount: 0,

        sessionDuration: 0,

        totalUsageDuration: 0,
        prevSessionTotalUsageTime: 0,

        config: {
            appName: null,
            appVersion: null,
            files: null,
            // locale: null,
            supportedLocales: null,
            // targetFps: null,
            sizeArea: {
                x: 0,
                y: 0,
                width: 1280,
                height: 1920
            } as Rectangle
        } as IAppConfigVO
    }
};

export type AppModuleState = typeof AppModuleInitialState;

export interface IAppConfigVO {
    appName: string;
    appVersion: number;
    files: any[];
    // locale: null,
    supportedLocales?: string[];
    // targetFps?: number;
    sizeArea: {
        x: number,
        y: number,
        width: number,
        height: number
    }
}