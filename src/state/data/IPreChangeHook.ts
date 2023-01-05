import { Flatten } from "./DeepKeyTypings";

export interface IPreChangeHook extends Function {
    <StateType, DeepKeyType extends keyof Flatten<StateType>, ValueType extends Flatten<StateType>[DeepKeyType]>(stateForTypings: StateType, deepKey: DeepKeyType, value: Partial<ValueType>): void;
}