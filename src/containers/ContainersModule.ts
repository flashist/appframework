import {serviceLocatorAdd} from "@flashist/flibs";

import {BaseAppModule} from "../base/modules/BaseAppModule";
import {ContainersManager} from "./managers/ContainersManager";

export class ContainersModule extends BaseAppModule {

    init(): void {
        super.init();

        serviceLocatorAdd(ContainersManager, {isSingleton: true});
    }
}