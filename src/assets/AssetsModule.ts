import {serviceLocatorAdd} from "@flashist/flibs";

import {BaseAppModule} from "../base/modules/BaseAppModule";
import {AssetsModel} from "./models/AssetsModel";

export class AssetsModule extends BaseAppModule {

    init(): void {
        super.init();

        serviceLocatorAdd(AssetsModel, {isSingleton: true});
    }
}