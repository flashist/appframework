import { Flatten } from "./DeepKeyTypings";
import { IAppStateChangeConfigVO } from "./IAppStateChangeConfigVO";

export interface IPreChangeHook extends Function {
    <StateType, DeepKeyType extends keyof Flatten<StateType>>(stateForTypings: StateType, deepKey: DeepKeyType, changeConfig: IAppStateChangeConfigVO): void;
}