import { Flatten } from "./DeepKeyTypings";

interface IChangeWrapper<WrapperStateType, WrapperDeepKeyType extends keyof Flatten<WrapperStateType, never> = keyof Flatten<WrapperStateType, never>> {
    (wrapperKey: WrapperDeepKeyType, value: Partial<Flatten<WrapperStateType, never>[WrapperDeepKeyType]>): void;
}