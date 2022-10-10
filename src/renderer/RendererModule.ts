import {serviceLocatorAdd} from "@flashist/flibs";

import {BaseAppModule} from "../base/modules/BaseAppModule";
import {RendererManager} from "./managers/RendererManager";

export class RendererModule extends BaseAppModule {

    init(): void {
        super.init();

        serviceLocatorAdd(RendererManager, {isSingleton: true, forceCreation: true});
    }

}