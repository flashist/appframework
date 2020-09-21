import {serviceLocatorAdd} from "@flashist/flibs";

import {GlobalEventDispatcher} from "./dispatcher/GlobalEventDispatcher";
import {BaseModule} from "../base/modules/BaseModule";

export class GlobalEventDispatcherModule extends BaseModule {

    init(): void {
        super.init();
        
        serviceLocatorAdd(GlobalEventDispatcher, {isSingleton: true})
    }

}