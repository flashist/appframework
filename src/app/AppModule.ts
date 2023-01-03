import { GenericObjectsByTypeModel, getInstance, serviceLocatorAdd } from "@flashist/flibs";

import { BaseAppModule } from "../base/modules/BaseAppModule";
import { AppModel } from "./models/AppModel";
import { AppConfigModel } from "./models/AppConfigModel";
import { AppManager } from "./managers/AppManager";

export class AppModule extends BaseAppModule {

    init(): void {
        super.init();

        serviceLocatorAdd(AppModel, { isSingleton: true });
        serviceLocatorAdd(AppConfigModel, { isSingleton: true });

        serviceLocatorAdd(AppManager, { isSingleton: true, forceCreation: true });
    }

    activateCompleteHook(): void {
        super.activateCompleteHook();

        const genericObjectsByTypeModel: GenericObjectsByTypeModel = getInstance(GenericObjectsByTypeModel);
        const model: AppConfigModel = getInstance(AppConfigModel);
        genericObjectsByTypeModel.mapModelToType(model, model.itemsType);
    }
}