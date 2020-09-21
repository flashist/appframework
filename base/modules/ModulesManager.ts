import {ArrayTools} from "@flashist/fcore";
import {BaseModule} from "./BaseModule";

export class ModulesManager {
    protected modules: BaseModule[] = [];

    destroy(): void {
        this.modules = [];
    }


    // Modules

    addModule(module: BaseModule): void {
        this.modules.push(module);
    }

    removeModule(module: BaseModule): void {
        ArrayTools.removeItem(this.modules, module);
    }

    initModules(): void {
        let modulesCount: number = this.modules.length;
        // Init all modules
        for (let moduleIndex: number = 0; moduleIndex < modulesCount; moduleIndex++) {
            this.modules[moduleIndex].init();
        }

        // Go through all modules and call the hook after completion,
        // to add a way to do something, when everything is prepared
        for (let moduleIndex: number = 0; moduleIndex < modulesCount; moduleIndex++) {
            this.modules[moduleIndex].initCompleteHook();
        }
    }

    activateModules(): void {
        let modulesCount: number = this.modules.length;
        // Go through all modules and call the hook after completion,
        // to add a way to do something, when everything is prepared
        for (let moduleIndex: number = 0; moduleIndex < modulesCount; moduleIndex++) {
            this.modules[moduleIndex].activateCompleteHook();
        }
    }
}