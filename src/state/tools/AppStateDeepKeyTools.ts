import { ObjectTools } from "@flashist/fcore";
import { AppStateChangeType } from "../data/AppStateChangeType";
import { IDeepKeyHelperVO } from "./INestedPathHelperVO";
import { IAppStateChangeConfigVO } from "../data";

export class AppStateDeepKeyTools {
    static prepareDeepKeyHelperData(deepKey: string, config: IAppStateChangeConfigVO = null): IDeepKeyHelperVO {
        const result: IDeepKeyHelperVO = {
            splitDeepKeyParts: [],
            dispatchingChangePaths: [],
            dispatchingChangePathsMap: {}
        };

        let tempTotalPath: string = "";
        const splitPaths: string[] = deepKey.split(".");
        for (let singleSplitPath of splitPaths) {
            result.splitDeepKeyParts.push(singleSplitPath);

            if (tempTotalPath) {
                tempTotalPath += ".";
            }
            tempTotalPath += singleSplitPath;
            result.dispatchingChangePaths.push(tempTotalPath);
            result.dispatchingChangePathsMap[tempTotalPath] = true;
        }

        if (config &&
            (config.changeType === AppStateChangeType.CHANGE || config.changeType === AppStateChangeType.SUBSTITUTE)) {
            if (!ObjectTools.isSimpleType(config.value)) {
                const getComplexValueKeyPaths = (value: any, valueDeepKey: string): string[] => {
                    let result: string[] = [valueDeepKey];

                    if (!ObjectTools.isSimpleType(value)) {
                        const keys: string[] = Object.keys(value);
                        for (let singleKey of keys) {
                            const singlePropValue: any = value[singleKey]
                            const singleKeyDeepKeyPaths: string[] = getComplexValueKeyPaths(singlePropValue, `${valueDeepKey}.${singleKey}`);
                            result.push(...singleKeyDeepKeyPaths);
                        }
                    }

                    return result;
                }

                const valueDeepKeyPaths: string[] = getComplexValueKeyPaths(config.value, deepKey);
                for (let singleValueDeepKeyPath of valueDeepKeyPaths) {
                    // tempTotalPath += "." + singleValueDeepKeyPath;
                    // result.dispatchingChangePaths.push(tempTotalPath);
                    const singleValueHelper: IDeepKeyHelperVO = AppStateDeepKeyTools.splitDeepKeyIntoEvents(singleValueDeepKeyPath);
                    for (let singleSplitDispatchingPart of singleValueHelper.dispatchingChangePaths) {
                        if (!result.dispatchingChangePathsMap[singleSplitDispatchingPart]) {
                            result.dispatchingChangePathsMap[singleSplitDispatchingPart] = true;
                            result.dispatchingChangePaths.push(singleSplitDispatchingPart);
                        }
                    }
                }
            }
        }

        return result;
    }

    static splitDeepKeyIntoEvents(deepKey: string): IDeepKeyHelperVO {
        const result: IDeepKeyHelperVO = {
            splitDeepKeyParts: [],

            dispatchingChangePaths: [],
            dispatchingChangePathsMap: {}
        };

        let tempTotalPath: string = "";
        const splitPaths: string[] = deepKey.split(".");
        for (let singleSplitPath of splitPaths) {
            result.splitDeepKeyParts.push(singleSplitPath);

            if (tempTotalPath) {
                tempTotalPath += ".";
            }
            tempTotalPath += singleSplitPath;
            result.dispatchingChangePaths.push(tempTotalPath);

            result.dispatchingChangePathsMap[tempTotalPath] = true;
        }

        return result;
    }
}