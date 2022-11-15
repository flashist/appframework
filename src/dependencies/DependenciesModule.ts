import { GenericObjectsByTypeModel, serviceLocatorAdd } from "@flashist/flibs";

import { BaseAppModule } from "../base/modules/BaseAppModule";

export class DependenciesModule extends BaseAppModule {

    init(): void {
        super.init();

        // Modules
        serviceLocatorAdd(GenericObjectsByTypeModel, { isSingleton: true });
    }
}