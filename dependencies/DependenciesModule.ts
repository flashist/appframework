import {
    GenericObjectsByTypeModel,
    serviceLocatorAdd
} from "@flashist/flibs";

import {BaseModule} from "../base/modules/BaseModule";

export class DependenciesModule extends BaseModule {

    init(): void {
        super.init();

        // Modules
        serviceLocatorAdd(GenericObjectsByTypeModel, {isSingleton: true});
    }
}