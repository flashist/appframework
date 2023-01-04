import { ObjectTools } from "@flashist/fcore";
import { Flatten } from "./DeepKeyTypings";
import { BaseObjectWithGlobalDispatcher } from "../../base/BaseObjectWithGlobalDispatcher";
import { AppStateEventChangeTools } from "../tools/AppStateEventChangeTools";
import { AppStateDeepKeyTools } from "../tools/AppStateDeepKeyTools";
import { IDeepKeyHelperVO } from "../tools/INestedPathHelperVO";
import { DeepReadonly } from "./DeepReadableTypings";
import { IPreChangeHook } from "./IPreChangeHook";

export class AppStateStorage extends BaseObjectWithGlobalDispatcher {

    protected isInitialized: boolean = false;

    protected state: object = {};

    protected pathsHelperDataCache: { [pathJsonText: string]: IDeepKeyHelperVO } = {};

    protected preChangeHooks: IPreChangeHook[] = [];

    public initializeWith<StateType extends object>(initState: StateType): void {
        if (this.isInitialized) {
            return;
        }

        ObjectTools.copyProps(
            this.state,
            initState
        );
    }

    public initializeComplete(): void {
        this.isInitialized = true;
    }

    public getState<StateType extends object>(): DeepReadonly<StateType> {
        return this.state as any;
    }

    protected dispatchChangeEvents(helperData: IDeepKeyHelperVO): void {
        for (let singleDispatchingChangePath of helperData.dispatchingChangePaths) {
            const eventName: string = AppStateEventChangeTools.getChangeEvent(singleDispatchingChangePath);
            this.dispatchEvent(eventName);
        }
    }

    protected getPathsHelperData(deepKey: string): IDeepKeyHelperVO {
        let result: IDeepKeyHelperVO = this.pathsHelperDataCache[deepKey];
        if (!result) {
            result = AppStateDeepKeyTools.prepareDeepKeyHelperData(deepKey);
            this.pathsHelperDataCache[deepKey] = result;
        }

        return result;
    }

    public change<StateType extends object>() {
        return <DeepKeyType extends keyof Flatten<StateType>>(key: DeepKeyType, value: Partial<Flatten<StateType>[DeepKeyType]>): void => {
            this.innerChange({} as StateType, key, value);
        }
    }

    protected innerChange<StateType, DeepKeyType extends keyof Flatten<StateType>, ValueType extends Flatten<StateType>[DeepKeyType]>(stateForTypings: StateType, deepKey: DeepKeyType, value: Partial<ValueType>): void {
        // Pre Change Hooks: execute pre-change-hooks on every element: e.g. ecs module hooks might change prepare the new ecs components to sort their container-type-keys to make sure they are always the same q
        if (this.preChangeHooks.length > 0) {
            this.preChangeHooks.forEach(
                (item: IPreChangeHook) => {
                    item<StateType, DeepKeyType, ValueType>(stateForTypings, deepKey, value);
                }
            );
        }

        const pathsHelperData: IDeepKeyHelperVO = this.getPathsHelperData(deepKey as string);

        let tempObject: any = this.state;
        let nestedPathsCount: number = pathsHelperData.splitDeepKeyParts.length;
        for (let nestedPathIndex: number = 0; nestedPathIndex < nestedPathsCount; nestedPathIndex++) {
            const singlePath: string | number = pathsHelperData.splitDeepKeyParts[nestedPathIndex];

            if (nestedPathIndex === (nestedPathsCount - 1)) {
                ObjectTools.copySinglePropFromValue(tempObject, singlePath as string, value);

            } else {
                tempObject = tempObject[singlePath];
            }
        }

        this.dispatchChangeEvents(pathsHelperData);
    }

    // // public change<StateType extends object, ChangeType>(nestedPaths: ObjectNestedPathsType<StateType>, value: ChangeType): void {
    // public change<StateType, DeepKeyType extends keyof Flatten<StateType>>(obj: StateType, key: DeepKeyType, value: Flatten<StateType>[DeepKeyType]): void {
    //     // AS ANY needed to calm compiler and autocomplete
    //     let tempObject: StateType = this.state as any;
    //     const pathsHelperData: IDeepKeyHelperVO = this.getPathsHelperData(nestedPaths as any);

    //     let nestedPathsCount: number = pathsHelperData.splitDeepKeyParts.length;
    //     for (let nestedPathIndex: number = 0; nestedPathIndex < nestedPathsCount; nestedPathIndex++) {
    //         const singlePath: string | number = pathsHelperData.splitDeepKeyParts[nestedPathIndex];

    //         if (nestedPathIndex === (nestedPathsCount - 1)) {
    //             // tempObject[singlePath] = value;
    //             ObjectTools.copySinglePropFromValue(tempObject, singlePath as string, value);

    //         } else {
    //             tempObject = tempObject[singlePath];
    //         }
    //     }

    //     this.dispatchChangeEvents(pathsHelperData);
    // }

    // public delete<StateType extends object>(nestedPaths: ObjectNestedPathsType<StateType>): void {
    //     // AS ANY needed to calm compiler and autocomplete
    //     let tempObject: StateType = this.state as any;
    //     const pathsHelperData: IDeepKeyHelperVO = this.getPathsHelperData(nestedPaths as any);

    //     let nestedPathsCount: number = pathsHelperData.splitDeepKeyParts.length;
    //     for (let nestedPathIndex: number = 0; nestedPathIndex < nestedPathsCount; nestedPathIndex++) {
    //         const singlePath: string | number = pathsHelperData.splitDeepKeyParts[nestedPathIndex];

    //         if (nestedPathIndex === (nestedPathsCount - 1)) {
    //             delete tempObject[singlePath];

    //         } else {
    //             tempObject = tempObject[singlePath];
    //         }
    //     }

    //     this.dispatchChangeEvents(pathsHelperData);
    // }

    // public addElements<StateType extends object, ElementType>(nestedPaths: ObjectNestedPathsType<StateType>, ...elements: ElementType[]): void {
    //     // AS ANY needed to calm compiler and autocomplete
    //     let tempObject: StateType = this.state as any;
    //     const pathsHelperData: IDeepKeyHelperVO = this.getPathsHelperData(nestedPaths as any);

    //     let nestedPathsCount: number = pathsHelperData.splitDeepKeyParts.length;
    //     for (let nestedPathIndex: number = 0; nestedPathIndex < nestedPathsCount; nestedPathIndex++) {
    //         const singlePath: string | number = pathsHelperData.splitDeepKeyParts[nestedPathIndex];
    //         tempObject = tempObject[singlePath];
    //     }

    //     (tempObject as Array<ElementType>).push(...elements);

    //     this.dispatchChangeEvents(pathsHelperData);
    // }

    // public removeElements<StateType extends object, ElementType>(nestedPaths: ObjectNestedPathsType<StateType>, ...elements: ElementType[]): void {
    //     // AS ANY needed to calm compiler and autocomplete
    //     let tempObject: StateType = this.state as any;
    //     const pathsHelperData: IDeepKeyHelperVO = this.getPathsHelperData(nestedPaths as any);

    //     let nestedPathsCount: number = pathsHelperData.splitDeepKeyParts.length;
    //     for (let nestedPathIndex: number = 0; nestedPathIndex < nestedPathsCount; nestedPathIndex++) {
    //         const singlePath: string | number = pathsHelperData.splitDeepKeyParts[nestedPathIndex];
    //         tempObject = tempObject[singlePath];
    //     }

    //     ArrayTools.removeItems((tempObject as Array<ElementType>), elements);

    //     this.dispatchChangeEvents(pathsHelperData);
    // }
}
