import {serviceLocatorAdd} from "@flashist/flibs";

import {BaseModule} from "../base/modules/BaseModule";
import {TimeManager} from "./managers/TimeManager";
import {TimeModel} from "./models/TimeModel";

export class TimeModule extends BaseModule {

    init(): void {
        super.init();

        serviceLocatorAdd(TimeModel, {isSingleton: true, forceCreation: true});
        serviceLocatorAdd(TimeManager, {isSingleton: true, forceCreation: true});
    }

}