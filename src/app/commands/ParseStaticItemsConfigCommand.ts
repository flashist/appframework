import { CommandErrorCode } from "@flashist/fcore";
import { AbstractLoadItem, GenericObjectsByTypeModel, getInstance, LoadManager } from "@flashist/flibs";

import { BaseAppCommand } from "../../base/commands/BaseAppCommand";
import { IEntity } from "../../ecs/ecs/entities/IEntity";
import { ECSManager } from "../../ecs/managers/ECSManager";
import { AppSettings } from "../AppSettings";
// import {IItemsConfigVO} from "../data/IItemsConfigVO";

export class ParseStaticItemsConfigCommand extends BaseAppCommand {

    protected executeInternal(): void {

        let loadManager: LoadManager = getInstance(LoadManager);
        let staticItemsConfigFileItem: AbstractLoadItem = loadManager.getLoadItem(AppSettings.staticItemsFileId);
        if (staticItemsConfigFileItem && staticItemsConfigFileItem.data) {

            if (staticItemsConfigFileItem.data) {
                const ecsManager: ECSManager = getInstance(ECSManager);
                const entitiyItems: IEntity[] = staticItemsConfigFileItem.data.entities;
                for (let singleEntityItem of entitiyItems) {
                    ecsManager.entities.add(singleEntityItem);
                }

                if (staticItemsConfigFileItem.data.items) {
                    const genericObjectsByTypeModel: GenericObjectsByTypeModel = getInstance(GenericObjectsByTypeModel);
                    genericObjectsByTypeModel.commitItems(staticItemsConfigFileItem.data.items);
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