import { GenericObjectsByTypeModel, serviceLocatorAdd } from "@flashist/flibs";

import { BaseAppModule } from "../base/modules/BaseAppModule";
import { getItem, getItemsForType } from "./DependenciesGenericObjectsShortucts";

export class DependenciesModule extends BaseAppModule {

    init(): void {
        super.init();

        // Modules
        serviceLocatorAdd(GenericObjectsByTypeModel, { isSingleton: true });
    }
}