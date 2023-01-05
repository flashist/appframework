import {serviceLocatorAdd} from "@flashist/flibs";
import {BaseAppModule} from "../base/modules/BaseAppModule";
import {LocalStorageManager} from "./managers/LocalStorageManager";

export class LocalStorageModule extends BaseAppModule {

    init(): void {
        super.init();

        serviceLocatorAdd(LocalStorageManager, {isSingleton: true, forceCreation: true});
    }

}