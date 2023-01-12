export interface IDeepKeyHelperVO {
    splitDeepKeyParts: string[],
    dispatchingChangePaths: string[],
    dispatchingChangePathsMap: Record<string, boolean>
}