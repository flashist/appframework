import {
    serviceLocatorAdd
} from "@flashist/flibs";

import {BaseModule} from "../base/modules/BaseModule";
import {HTMLManager} from "./managers/HTMLManager";

export class HTMLModule extends BaseModule {

    init(): void {
        super.init();

        serviceLocatorAdd(HTMLManager, {isSingleton: true, forceCreation: true});
    }
}