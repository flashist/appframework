import {serviceLocatorAdd} from "@flashist/flibs";

import {BaseAppModule} from "../base/modules/BaseAppModule";
import {ServerModel} from "./models/ServerModel";

export class ServerModule extends BaseAppModule {

    init(): void {
        super.init();

        serviceLocatorAdd(ServerModel, {isSingleton: true});
    }

}