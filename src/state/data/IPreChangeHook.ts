import { Flatten } from "./DeepKeyTypings";
import { IAppStateChangeConfigVO } from "./IappStateChangeConfigVO";

export interface IPreChangeHook extends Function {
    <StateType, DeepKeyType extends keyof Flatten<StateType>>(stateForTypings: StateType, deepKey: DeepKeyType, changeConfig: IAppStateChangeConfigVO): void;
}