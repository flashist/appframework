import {
    LoadManager,
    LoadFactory,
    serviceLocatorAdd,
    getInstance
} from "@flashist/flibs";

import {BaseModule} from "../base/modules/BaseModule";

export class LoadModule extends BaseModule {

    constructor(protected basePath: string = "") {
        super();
    }

    init(): void {
        super.init();

        // Load
        serviceLocatorAdd(LoadManager, {isSingleton: true, forceCreation: true});
    }

    activateCompleteHook(): void {
        super.activateCompleteHook();

        LoadFactory.instance.basePath = this.basePath;
    }
}