export interface IAppModelLocalStorageVO {
    appLaunchesCount: number;
    totalUsageDuration: number;

    curLaunchStartTimestamp: number;
    prevLaunchTimestamp: number;
    appDaysLaunchesCount: number;
    appDaysLaunchesCount_consequent_withMaxBreaks_Day1: number;
    appDaysLaunchesCount_consequent_withMaxBreaks_Day3: number;
    appDaysLaunchesCount_consequent_withMaxBreaks_Day7: number;
}