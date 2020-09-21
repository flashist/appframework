import {serviceLocatorAdd, LocaleManager} from "@flashist/flibs";
import {BaseModule} from "../base/modules/BaseModule";

export class LocalesModule extends BaseModule {

    init(): void {
        super.init();

        serviceLocatorAdd(LocaleManager, {isSingleton: true});
    }
}