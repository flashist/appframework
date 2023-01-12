import { ObjectTools } from "@flashist/fcore";
import { IDeepKeyHelperVO } from "./INestedPathHelperVO";

export class AppStateDeepKeyTools {
    static prepareDeepKeyHelperData(deepKey: string, value: any): IDeepKeyHelperVO {
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

        if (!ObjectTools.isSimpleType(value)) {
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

            const valueDeepKeyPaths: string[] = getComplexValueKeyPaths(value, deepKey);
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