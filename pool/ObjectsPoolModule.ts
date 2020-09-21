import {ObjectsPool} from "@flashist/fcore";
import {serviceLocatorAdd, ServiceLocatorObjectsPool} from "@flashist/flibs";

import {BaseModule} from "../base/modules/BaseModule";

export class ObjectsPoolModule extends BaseModule {
    init(): void {
        super.init();

        serviceLocatorAdd(ObjectsPool, {isSingleton: true});
        serviceLocatorAdd(ServiceLocatorObjectsPool, {toSubstitute: ObjectsPool});
    }
}