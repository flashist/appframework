export const TimeModuleInitialAppState = {
    timeModule: {
        startTime: 0,
        curTime: 0,
        lastTimeDelta: 0,
        minTimeDelta: 0,
        maxTimeDelta: 0
    }
};

export type TimeModuleAppStateType = typeof TimeModuleInitialAppState;