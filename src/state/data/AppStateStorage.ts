import { ObjectTools } from "@flashist/fcore";
import { Flatten } from "./DeepKeyTypings";
import { BaseObjectWithGlobalDispatcher } from "../../base/BaseObjectWithGlobalDispatcher";
import { AppStateEventChangeTools } from "../tools/AppStateEventChangeTools";
import { AppStateDeepKeyTools } from "../tools/AppStateDeepKeyTools";
import { IDeepKeyHelperVO } from "../tools/INestedPathHelperVO";
import { DeepReadonly } from "./DeepReadableTypings";
import { IPreChangeHook } from "./IPreChangeHook";
import { IAppStateChangeConfigVO } from "./IappStateChangeConfigVO";
import { AppStateChangeType } from "./AppStateChangeType";
import { DeepPartial } from "./DeepPartialTypings";

export class AppStateStorage extends BaseObjectWithGlobalDispatcher {

    /**
     * The purpose of the method is to "prepare" a "wrapper" of a part of a state,
     * to avoid constant writings of the full path. So instead of:
     * change<MyType>()("a.b.c.2.test1", value);
     * change<MyType>()("a.b.c.2.test2", value);
     * change<MyType>()("a.b.c.2.test3", value);
     * change<MyType>()("a.b.c.2.test4", value);
     * 
     * You can do
     * const changeWrapper = changePropertyWrapper<MyType>("a.b.c.2");
     * changeWrapper("test1", value)
     * changeWrapper("test2", value)
     * changeWrapper("test3", value)
     * changeWrapper("test4", value)
     * 
     * How to use:
     *  const testWrapper = this.changePropertyWrapper<TestState>()("b.complexObject");
        testWrapper("test1", "1")

     * @returns 
     */
    public changePropertyWrapper<StateType extends object>() {
        return <WrapperStateType extends Partial<Flatten<StateType>[DeepKeyType]>, DeepKeyType extends keyof Flatten<StateType>>(key: DeepKeyType) => {
            return <WrapperDeepKeyType extends keyof Flatten<WrapperStateType>>(wrapperKey: WrapperDeepKeyType, value: DeepPartial<Flatten<WrapperStateType>[WrapperDeepKeyType]>): void => {
                this.innerChange({} as StateType, (`${key as string}.${wrapperKey as string}`) as any, value);
            }
        }
    }

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

    public getMutableState<StateType extends object>(): StateType {
        return this.state as any;
    }

    protected dispatchChangeEvents(helperData: IDeepKeyHelperVO): void {
        for (let singleDispatchingChangePath of helperData.dispatchingChangePaths) {
            const eventName: string = AppStateEventChangeTools.getChangeEvent(singleDispatchingChangePath);
            this.dispatchEvent(eventName);
        }
    }

    protected getPathsHelperData(deepKey: string, config: IAppStateChangeConfigVO = null): IDeepKeyHelperVO {
        let result: IDeepKeyHelperVO = null;
        // Simple data changes can be cached
        if (config && ObjectTools.isSimpleType(config.value)) {
            result = this.pathsHelperDataCache[deepKey];
            if (!result) {
                result = AppStateDeepKeyTools.prepareDeepKeyHelperData(deepKey, config);
                this.pathsHelperDataCache[deepKey] = result;
            }

            // Complex data changes can't be cached and will have to be recalculated every time
        } else {
            //  TODO: find a way to cach complex-data changes
            //  (I am not sure it's possible, because it depends on the value-object structure which can be changed, even if the deepKey is the same)
            result = AppStateDeepKeyTools.prepareDeepKeyHelperData(deepKey, config);
        }


        return result;
    }

    protected triggerPreChangeHooks<StateType, DeepKeyType extends keyof Flatten<StateType>>(stateForTypings: StateType, deepKey: DeepKeyType, config: IAppStateChangeConfigVO): void {
        if (this.preChangeHooks.length <= 0) {
            return;
        }

        this.preChangeHooks.forEach(
            (item: IPreChangeHook) => {
                item(stateForTypings, deepKey, config);
            }
        );
    }

    public getValue<StateType extends object>() {
        return <DeepKeyType extends keyof Flatten<StateType>>(key: DeepKeyType): Partial<Flatten<StateType>[DeepKeyType]> => {
            return this.innerGetValue({} as StateType, key);
        }
    }

    protected innerGetValue<StateType, DeepKeyType extends keyof Flatten<StateType>, ValueType extends Flatten<StateType>[DeepKeyType]>(stateForTypings: StateType, deepKey: DeepKeyType): Partial<ValueType> {

        let result: Partial<ValueType>;

        const pathsHelperData: IDeepKeyHelperVO = this.getPathsHelperData(deepKey as string, null);
        // console.log("AppStateStorage | innerChange __ pathsHelperData: ", pathsHelperData);

        let tempObject: any = this.state;
        let nestedPathsCount: number = pathsHelperData.splitDeepKeyParts.length;
        for (let nestedPathIndex: number = 0; nestedPathIndex < nestedPathsCount; nestedPathIndex++) {
            const singlePath: string | number = pathsHelperData.splitDeepKeyParts[nestedPathIndex];

            if (nestedPathIndex === (nestedPathsCount - 1)) {
                result = tempObject[singlePath]

            } else {
                tempObject = tempObject[singlePath];
            }
        }

        return result;
    }

    protected processStateAction<StateType, DeepKeyType extends keyof Flatten<StateType>, ValueType extends Flatten<StateType>[DeepKeyType]>(stateForTypings: StateType, deepKey: DeepKeyType, config: IAppStateChangeConfigVO<ValueType>) {
        let result: any;

        const pathsHelperData: IDeepKeyHelperVO = this.getPathsHelperData(deepKey as string, config);
        // console.log("AppStateStorage | innerChange __ pathsHelperData: ", pathsHelperData);

        let tempObject: any = this.state;
        let nestedPathsCount: number = pathsHelperData.splitDeepKeyParts.length;
        for (let nestedPathIndex: number = 0; nestedPathIndex < nestedPathsCount; nestedPathIndex++) {
            const singlePath: string | number = pathsHelperData.splitDeepKeyParts[nestedPathIndex];

            if (nestedPathIndex === (nestedPathsCount - 1)) {
                // ObjectTools.copySinglePropFromValue(tempObject, singlePath as string, value);

                if (config.changeType === AppStateChangeType.SUBSTITUTE) {
                    delete tempObject[singlePath];
                    ObjectTools.copySinglePropFromValue(tempObject, singlePath as string, config.value);

                } else if (config.changeType === AppStateChangeType.CHANGE) {
                    ObjectTools.copySinglePropFromValue(tempObject, singlePath as string, config.value);

                } else if (config.changeType === AppStateChangeType.DELETE) {
                    result = tempObject[singlePath];
                    delete tempObject[singlePath];

                } else if (config.changeType === AppStateChangeType.PUSH) {
                    tempObject[singlePath].push(...config.elements);

                } else if (config.changeType === AppStateChangeType.SPLICE) {
                    result = tempObject[singlePath].splice(config.start, config.deleteCount);
                }

            } else {
                tempObject = tempObject[singlePath];
            }
        }

        this.dispatchChangeEvents(pathsHelperData);

        return result;
    }

    // SUBSTITUTE: START
    public substitute<StateType extends object>() {
        return <DeepKeyType extends keyof Flatten<StateType>>(key: DeepKeyType, value: DeepPartial<Flatten<StateType>[DeepKeyType]>): void => {
            this.innerSubstitute({} as StateType, key, value);
        }
    }

    protected innerSubstitute<StateType, DeepKeyType extends keyof Flatten<StateType>, ValueType extends Flatten<StateType>[DeepKeyType]>(stateForTypings: StateType, deepKey: DeepKeyType, value: DeepPartial<ValueType>): void {
        const config: IAppStateChangeConfigVO = {
            changeType: AppStateChangeType.SUBSTITUTE,
            value: value
        };

        // Pre Change Hooks: execute pre-change-hooks on every element: e.g. ecs module hooks might change prepare the new ecs components to sort their container-type-keys to make sure they are always the same q
        this.triggerPreChangeHooks(stateForTypings, deepKey, config);

        this.processStateAction(stateForTypings, deepKey, config);
    }
    // SUBSTITUTE: END


    // CHANGE: START

    public change<StateType extends object>() {
        return <DeepKeyType extends keyof Flatten<StateType>>(key: DeepKeyType, value: DeepPartial<Flatten<StateType>[DeepKeyType]>): void => {
            this.innerChange({} as StateType, key, value);
        }
    }

    protected innerChange<StateType, DeepKeyType extends keyof Flatten<StateType>, ValueType extends Flatten<StateType>[DeepKeyType]>(stateForTypings: StateType, deepKey: DeepKeyType, value: DeepPartial<ValueType>): void {
        const config: IAppStateChangeConfigVO = {
            changeType: AppStateChangeType.CHANGE,
            value: value
        };

        // Pre Change Hooks: execute pre-change-hooks on every element: e.g. ecs module hooks might change prepare the new ecs components to sort their container-type-keys to make sure they are always the same q
        this.triggerPreChangeHooks(stateForTypings, deepKey, config);

        this.processStateAction(stateForTypings, deepKey, config);
    }

    // CHANGE: END

    // DELETE: START
    public delete<StateType extends object>() {
        return <
            DeepKeyType extends keyof Flatten<StateType>,
            ValueType extends Flatten<StateType>[DeepKeyType] & Array<any> = Flatten<StateType>[DeepKeyType] & Array<any>
        >(key: DeepKeyType) => {
            return this.innerDelete({} as StateType, key);
        }
    }

    protected innerDelete
        <
            StateType,
            DeepKeyType extends keyof Flatten<StateType>,
            ValueType extends Flatten<StateType>[DeepKeyType]
        >(stateForTypings: StateType, deepKey: DeepKeyType): ValueType {

        const config: IAppStateChangeConfigVO = {
            changeType: AppStateChangeType.DELETE
        };

        // Pre Change Hooks: execute pre-change-hooks on every element: e.g. ecs module hooks might change prepare the new ecs components to sort their container-type-keys to make sure they are always the same q
        this.triggerPreChangeHooks(stateForTypings, deepKey, config);

        return this.processStateAction(stateForTypings, deepKey, config);
    }
    // DELETE: END


    // PUSH: START
    public push<StateType extends object>() {
        return <
            DeepKeyType extends keyof Flatten<StateType>,
            ArrayType extends Flatten<StateType>[DeepKeyType] & Array<any> = Flatten<StateType>[DeepKeyType] & Array<any>
        >(key: DeepKeyType, ...elements: ArrayType) => {
            return this.innerPush({} as StateType, key, ...elements);
        }
    }

    protected innerPush
        <
            StateType,
            DeepKeyType extends keyof Flatten<StateType>,
            ArrayType extends Flatten<StateType>[DeepKeyType] & Array<any> = Flatten<StateType>[DeepKeyType] & Array<any>
        >(stateForTypings: StateType, deepKey: DeepKeyType, ...elements: ArrayType): void {

        const config: IAppStateChangeConfigVO = {
            changeType: AppStateChangeType.PUSH,
            elements: elements
        };

        // Pre Change Hooks: execute pre-change-hooks on every element: e.g. ecs module hooks might change prepare the new ecs components to sort their container-type-keys to make sure they are always the same q
        this.triggerPreChangeHooks(stateForTypings, deepKey, config);

        this.processStateAction(stateForTypings, deepKey, config);
    }
    // PUSH: END


    // SPLICE: START
    public splice<StateType extends object>() {
        return <
            DeepKeyType extends keyof Flatten<StateType>,
            ArrayType extends Flatten<StateType>[DeepKeyType] & Array<any> = Flatten<StateType>[DeepKeyType] & Array<any>
        >(key: DeepKeyType, start: number, deleteCount?: number) => {
            return this.innerSplice({} as StateType, key, start, deleteCount);
        }
    }

    protected innerSplice
        <
            StateType,
            DeepKeyType extends keyof Flatten<StateType>,
            ArrayType extends Flatten<StateType>[DeepKeyType]
        >(stateForTypings: StateType, deepKey: DeepKeyType, start: number, deleteCount?: number): ArrayType[] {

        if (deleteCount === undefined) {
            deleteCount = Number.MAX_SAFE_INTEGER;
        }

        const config: IAppStateChangeConfigVO = {
            changeType: AppStateChangeType.SPLICE,
            start: start,
            deleteCount: deleteCount
        };

        // Pre Change Hooks: execute pre-change-hooks on every element: e.g. ecs module hooks might change prepare the new ecs components to sort their container-type-keys to make sure they are always the same q
        this.triggerPreChangeHooks(stateForTypings, deepKey, config);

        return this.processStateAction(stateForTypings, deepKey, config);
    }
    // SPLICE: END

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