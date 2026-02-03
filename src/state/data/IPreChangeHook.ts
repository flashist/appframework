import { Flatten } from "./DeepKeyTypings";
import { DefaultFlattenDepth } from "./DeepTypeUtils";
import { IAppStateChangeConfigVO } from "./IAppStateChangeConfigVO";

export interface IPreChangeHook extends Function {
    <StateType, D extends number = DefaultFlattenDepth, DeepKeyType extends keyof Flatten<StateType, never, D> = keyof Flatten<StateType, never, D>>(
        stateForTypings: StateType,
        deepKey: DeepKeyType,
        changeConfig: IAppStateChangeConfigVO
    ): void;
}
