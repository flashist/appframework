import { Rectangle } from "pixi.js";

export const AppModuleInitialState = {
    app: {
        debug: false,

        appLaunchesCount: 0,

        sessionStartTime: 0,
        sessionDuration: 0,

        totalUsageDuration: 0,
        previousSessionTotalUsageTime: 0,

        config: {
            appName: null,
            appVersion: null,
            files: null,
            // locale: null,
            supportedLocales: null,
            targetFps: null,
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
    targetFps?: number;
    sizeArea: {
        x: number,
        y: number,
        width: number,
        height: number
    }
}