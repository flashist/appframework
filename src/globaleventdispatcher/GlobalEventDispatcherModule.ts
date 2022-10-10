import {serviceLocatorAdd} from "@flashist/flibs";

import {GlobalEventDispatcher} from "./dispatcher/GlobalEventDispatcher";
import {BaseAppModule} from "../base/modules/BaseAppModule";
import {GlobalEventsCommandManager} from "./managers/GlobalEventsCommandManager";

export class GlobalEventDispatcherModule extends BaseAppModule {

    init(): void {
        super.init();
        
        serviceLocatorAdd(GlobalEventDispatcher, {isSingleton: true});
        serviceLocatorAdd(GlobalEventsCommandManager, {isSingleton: true});
    }

}