import { LoadFactory, LoadManager, serviceLocatorAdd } from "@flashist/flibs";

import { BaseAppModule } from "../base/modules/BaseAppModule";

export class LoadModule extends BaseAppModule {

    constructor(protected basePath: string = "") {
        super();
    }

    init(): void {
        super.init();

        // Load
        serviceLocatorAdd(LoadManager, { isSingleton: true, forceCreation: true });
    }

    postCompleteHook(): void {
        super.postCompleteHook();

        LoadFactory.instance.basePath = this.basePath;
    }
}