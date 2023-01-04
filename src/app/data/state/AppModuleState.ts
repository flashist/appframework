import { Rectangle } from "pixi.js";

export const AppModuleInitialState = {
    app: {
        appLaunchesCount: 0,
        totalUsageDuration: 0,

        sessionStartTime: 0,
        previousSessionTotalUsageTime: 0,

        config: {
            appName: null,
            appVersion: null,
            files: null,
            locale: null,
            targetFps: null,
            sizeArea: null as Rectangle
        }
    }
};

export type AppModuleState = typeof AppModuleInitialState;