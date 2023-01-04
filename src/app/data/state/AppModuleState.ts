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
            sizeArea: {
                x: 0,
                y: 0,
                width: 1920,
                height: 1080
            } as Rectangle
        }
    }
};

export type AppModuleState = typeof AppModuleInitialState;