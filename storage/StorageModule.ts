import {serviceLocatorAdd} from "@flashist/flibs";
import {BaseModule} from "../base/modules/BaseModule";
import {StorageManager} from "./managers/StorageManager";

export class StorageModule extends BaseModule {

    init(): void {
        super.init();

        serviceLocatorAdd(StorageManager, {isSingleton: true, forceCreation: true});
    }

}