import { IDeepKeyHelperVO } from "./INestedPathHelperVO";

export class AppStateDeepKeyTools {
    static prepareDeepKeyHelperData(deepKey: string): IDeepKeyHelperVO {
        const result: IDeepKeyHelperVO = {
            splitDeepKeyParts: [],
            dispatchingChangePaths: []
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
        }

        return result;
    }
}