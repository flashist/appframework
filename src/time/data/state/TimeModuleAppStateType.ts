export const TimeModuleInitialAppState = {
    timeModule: {
        startTime: 0,
        curTime: 0,
        lastTimeDelta: 0,
        minTimeDelta: 1000 / 16,
        maxTimeDelta: 1000 / 16
    }
};

export type TimeModuleAppStateType = typeof TimeModuleInitialAppState;