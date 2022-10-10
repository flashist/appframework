import {serviceLocatorAdd} from "@flashist/flibs";

import {BaseAppModule} from "../base/modules/BaseAppModule";
import {HTMLManager} from "./managers/HTMLManager";

export class HTMLModule extends BaseAppModule {

    init(): void {
        super.init();

        serviceLocatorAdd(HTMLManager, {isSingleton: true, forceCreation: true});
    }
}