import {serviceLocatorAdd} from "@flashist/flibs";

import {BaseAppModule} from "../base/modules/BaseAppModule";
import {TimeManager} from "./managers/TimeManager";
import {TimeModel} from "./models/TimeModel";

export class TimeModule extends BaseAppModule {

    init(): void {
        super.init();

        serviceLocatorAdd(TimeModel, {isSingleton: true, forceCreation: true});
        serviceLocatorAdd(TimeManager, {isSingleton: true, forceCreation: true});
    }

}