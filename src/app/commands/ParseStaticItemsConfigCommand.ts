import { CommandErrorCode } from "@flashist/fcore";
import { AbstractLoadItem, GenericObjectsByTypeModel, getInstance, LoadManager } from "@flashist/flibs";

import { BaseAppCommand } from "../../base/commands/BaseAppCommand";
import { IEntity } from "../../ecs/ecs/entities/IEntity";
import { ECSManager } from "../../ecs/managers/ECSManager";
import { AppSettings } from "../AppSettings";
import { appStorage } from "../../state";
// import {IItemsConfigVO} from "../data/IItemsConfigVO";

export class ParseStaticItemsConfigCommand extends BaseAppCommand {

    protected executeInternal(): void {

        let loadManager: LoadManager = getInstance(LoadManager);
        let staticItemsConfigFileItem: AbstractLoadItem = loadManager.getLoadItem(AppSettings.staticItemsFileId);
        if (staticItemsConfigFileItem && staticItemsConfigFileItem.data) {

            if (staticItemsConfigFileItem.data) {
                if (staticItemsConfigFileItem.data.entities) {
                    const ecsManager: ECSManager = getInstance(ECSManager);
                    for (let singleEntityItem of staticItemsConfigFileItem.data.entities) {
                        ecsManager.entities.add(singleEntityItem);
                    }
                }

                if (staticItemsConfigFileItem.data.items) {
                    const genericObjectsByTypeModel: GenericObjectsByTypeModel = getInstance(GenericObjectsByTypeModel);
                    genericObjectsByTypeModel.commitItems(staticItemsConfigFileItem.data.items);
                }

                if (staticItemsConfigFileItem.data.state) {
                    // Do this strange hack to initialize AppStorageState data from the loaded config,
                    // we can't change ths state from the root, because the code doesn't allow it,
                    // also we need to provide a type to check, so we provide the type with all possible keys
                    const topLevelStateKeys: string[] = Object.keys(staticItemsConfigFileItem.data.state);
                    for (let singleTopLevelKey of topLevelStateKeys) {
                        appStorage().change<{ [key: string]: any }>()(singleTopLevelKey, staticItemsConfigFileItem.data.state[singleTopLevelKey]);
                    }
                }
            }

            this.notifyComplete();

        } else {
            console.error("ParseStaticItemsCommand | executeInternal __ ERROR! Can't find config file!");
            this.errorCode = CommandErrorCode.GENERAL_ERROR;
            this.terminate();
        }

    }

}