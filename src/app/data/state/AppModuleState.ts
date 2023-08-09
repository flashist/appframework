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
            locale: null,
            targetFps: null,
            sizeArea: {
                x: 0,
                y: 0,
                width: 1280,
                height: 1920
            } as Rectangle
        }
    }
};

export type AppModuleState = typeof AppModuleInitialState;