import { getInstance, serviceLocatorAdd } from "@flashist/flibs";
import { BaseAppModule } from "../base/modules/BaseAppModule";
import { ECSManager } from "../ecs/managers/ECSManager";
import { RenderSystem } from "./ecs/systems/RenderSystem";

export class ECSRenderModule extends BaseAppModule {

    init(): void {
        super.init();

        //
        serviceLocatorAdd(RenderSystem, { isSingleton: true });
    }

    postCompleteHook(): void {
        super.postCompleteHook();

        const system = getInstance(RenderSystem);
        getInstance(ECSManager).systems.add(system);
    }
}