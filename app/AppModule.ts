import {serviceLocatorAdd} from "@flashist/flibs";

import {BaseModule} from "../base/modules/BaseModule";
import {AppModel} from "./models/AppModel";
import {AppConfigModel} from "./models/AppConfigModel";
import {AppManager} from "./managers/AppManager";

export class AppModule extends BaseModule {

    init(): void {
        super.init();

        serviceLocatorAdd(AppModel, {isSingleton: true});
        serviceLocatorAdd(AppConfigModel, {isSingleton: true});

        serviceLocatorAdd(AppManager, {isSingleton: true, forceCreation: true});
    }
}