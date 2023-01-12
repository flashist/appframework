import { serviceLocatorAdd } from "@flashist/flibs";
import { BaseAppModule } from "../base/modules/BaseAppModule";
import { appStorage } from "../state/AppStateModule";
import { ECSManager } from "./managers/ECSManager";

export class ECSModule extends BaseAppModule {

    init(): void {
        super.init();

        serviceLocatorAdd(ECSManager, { isSingleton: true, forceCreation: true });
    }
}