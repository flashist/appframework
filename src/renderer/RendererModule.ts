import { serviceLocatorAdd } from "@flashist/flibs";

import { BaseAppModule } from "../base/modules/BaseAppModule";
import { RendererManagerConfigVO } from "./data/RendererManagerConfigVO";
import { RendererManager } from "./managers/RendererManager";

export class RendererModule extends BaseAppModule {

    init(): void {
        super.init();

        serviceLocatorAdd(RendererManagerConfigVO, { isSingleton: true });
        serviceLocatorAdd(RendererManager, { isSingleton: true, forceCreation: true });
    }

}