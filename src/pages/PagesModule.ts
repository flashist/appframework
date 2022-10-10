import {serviceLocatorAdd} from "@flashist/flibs";

import {PagesModel} from "./models/PagesModel";
import {BaseAppModule} from "../base/modules/BaseAppModule";

export class PagesModule extends BaseAppModule {

    init(): void {
        super.init();

        serviceLocatorAdd(PagesModel, {isSingleton: true});
    }
}