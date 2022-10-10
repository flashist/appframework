import {ObjectsPool} from "@flashist/fcore";
import {serviceLocatorAdd, ServiceLocatorObjectsPool} from "@flashist/flibs";

import {BaseAppModule} from "../base/modules/BaseAppModule";

export class ObjectsPoolModule extends BaseAppModule {
    init(): void {
        super.init();

        serviceLocatorAdd(ObjectsPool, {isSingleton: true});
        serviceLocatorAdd(ServiceLocatorObjectsPool, {toSubstitute: ObjectsPool});
    }
}