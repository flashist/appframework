export const TimeModuleInitialAppState = {
    time: {
        startTime: 0,
        curTime: 0,
        lastTimeDelta: 0,
        lastTimeDeltaSec: 0,
        minTimeDelta: 0,
        maxTimeDelta: 0
    }
};

export type TimeModuleAppState = typeof TimeModuleInitialAppState;