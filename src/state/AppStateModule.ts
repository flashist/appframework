import { getInstance, serviceLocatorAdd } from "@flashist/flibs";
import { BaseAppModule } from "../base/modules/BaseAppModule"
import { AppStateStorage } from "./data/AppStateStorage";
import { Flatten } from "./data/DeepKeyTypings";
import { AppStateEventChangeTools } from "./tools/AppStateEventChangeTools";

export class AppStateModule extends BaseAppModule {

    init(): void {
        super.init();

        serviceLocatorAdd(AppStateStorage, { isSingleton: true });
    }

    initCompleteHook(): void {
        super.initCompleteHook();

        getInstance(AppStateStorage).initializeComplete();
    }
}

export const appStorage = () => {
    return getInstance(AppStateStorage);
}

export const appStateChangeEvent = <StateType extends object>() => {
    return <DeepKeyType extends keyof Flatten<StateType>>(deepKey: DeepKeyType): string => {
        return AppStateEventChangeTools.getChangeEvent(deepKey)
    }
}

/**
//
export const getAppStateStorage = (): AppStateStorage => {
    return getInstance(AppStateStorage);
};
export const getAppState = getAppStateStorage().getState.bind;
// export const appStateInitializeWith = getAppStateStorage().initializeWith;

export const getAppStateChangeEventName = <StateType extends object>() => {
    return <DeepKeyType extends keyof Flatten<StateType>>(deepKey: DeepKeyType): string => {
        return AppStateEventChangeTools.getChangeEvent(deepKey)
    }
}

// MODIFICATIONS

// export const appStateChange = getInstance(AppStateStorage).change;
export const appStateChange = <StateType extends object>() => {
    return <DeepKeyType extends keyof Flatten<StateType>>(key: DeepKeyType, value: Flatten<StateType>[DeepKeyType]): void => {
        const appStateStorage: AppStateStorage = getAppStateStorage();
        appStateStorage.change({} as StateType, key, value);
    }
}

// export const appStateDelete = <StateType extends object>(nestedPaths: ObjectNestedPathsType<StateType>) => {
//     getInstance(AppStateStorage).delete<StateType>(nestedPaths);
// }

// export const appStateAddElements = <StateType extends object, ElementType>(nestedPaths: ObjectNestedPathsType<StateType>, ...elements: ElementType[]) => {
//     getInstance(AppStateStorage).addElements<StateType, ElementType>(nestedPaths, ...elements);
// }

// export const appStateRemoveElements = <StateType extends object, ElementType>(nestedPaths: ObjectNestedPathsType<StateType>, ...elements: ElementType[]) => {
//     getInstance(AppStateStorage).removeElements<StateType, ElementType>(nestedPaths, ...elements);
// }

**/