import {serviceLocatorAdd} from "@flashist/flibs";

import {PagesModel} from "./models/PagesModel";
import {BaseModule} from "../base/modules/BaseModule";

export class PagesModule extends BaseModule {

    init(): void {
        super.init();

        serviceLocatorAdd(PagesModel, {isSingleton: true});
    }
}