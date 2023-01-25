import { AppStateChangeType } from "./AppStateChangeType";

export interface IAppStateChangeConfigVO<ValueType extends any = any, ArrayType = ValueType & Array<any>> {
    changeType: AppStateChangeType,
    value?: Partial<ValueType>,
    elements?: ArrayType,
    start?: number;
    deleteCount?: number;
}