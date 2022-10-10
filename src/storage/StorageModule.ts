import {serviceLocatorAdd} from "@flashist/flibs";
import {BaseAppModule} from "../base/modules/BaseAppModule";
import {StorageManager} from "./managers/StorageManager";

export class StorageModule extends BaseAppModule {

    init(): void {
        super.init();

        serviceLocatorAdd(StorageManager, {isSingleton: true, forceCreation: true});
    }

}