import {LocaleManager, serviceLocatorAdd} from "@flashist/flibs";
import {BaseAppModule} from "../base/modules/BaseAppModule";

export class LocalesModule extends BaseAppModule {

    init(): void {
        super.init();

        serviceLocatorAdd(LocaleManager, {isSingleton: true});
    }
}