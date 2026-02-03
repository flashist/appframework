import { Flatten } from "./DeepKeyTypings";
import { DefaultFlattenDepth } from "./DeepTypeUtils";

export interface IChangeWrapper<
    WrapperStateType,
    D extends number = DefaultFlattenDepth,
    WrapperDeepKeyType extends keyof Flatten<WrapperStateType, never, D> = keyof Flatten<WrapperStateType, never, D>
> {
    (wrapperKey: WrapperDeepKeyType, value: Partial<Flatten<WrapperStateType, never, D>[WrapperDeepKeyType]>): void;
}
