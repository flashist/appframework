import { GenericObjectsByTypeModel, getInstance, serviceLocatorAdd } from "@flashist/flibs";

import { BaseAppModule } from "../base/modules/BaseAppModule";
import { DependenciesGenericObjectsShortucts, getItem, getItemsForType } from "./DependenciesGenericObjectsShortucts";

export class DependenciesModule extends BaseAppModule {

    init(): void {
        super.init();

        // Modules
        serviceLocatorAdd(GenericObjectsByTypeModel, { isSingleton: true });
    }

    activateCompleteHook(): void {
        super.activateCompleteHook();

        const genericObjectByTypeModel: GenericObjectsByTypeModel = getInstance(GenericObjectsByTypeModel);
        DependenciesGenericObjectsShortucts.getItem = genericObjectByTypeModel.getItem.bind(genericObjectByTypeModel);
        DependenciesGenericObjectsShortucts.getItemsForType = genericObjectByTypeModel.getItemsForType.bind(genericObjectByTypeModel);

        // export const getItem: typeof GenericObjectsByTypeModel.prototype.getItem = (() => {
        //     const genericObjectByTypeModel: GenericObjectsByTypeModel = getInstance(GenericObjectsByTypeModel);
        //     return genericObjectByTypeModel.getItem.bind(genericObjectByTypeModel);
        // })();

        // export const getItemsForType: typeof GenericObjectsByTypeModel.prototype.getItemsForType = (() => {
        //     const genericObjectByTypeModel: GenericObjectsByTypeModel = getInstance(GenericObjectsByTypeModel);
        //     return genericObjectByTypeModel.getItemsForType.bind(genericObjectByTypeModel);
        // })();
    }
}