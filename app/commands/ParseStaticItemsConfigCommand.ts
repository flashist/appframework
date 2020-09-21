import {CommandErrorCode} from "@flashist/fcore";
import {
    getInstance,
    LoadManager,
    AbstractLoadItem,
    GenericObjectsByTypeModel
} from "@flashist/flibs";

import {BaseAppCommand} from "../../base/commands/BaseAppCommand";
import {AppSettings} from "../AppSettings";
import {IItemsConfigVO} from "../data/IItemsConfigVO";

export class ParseStaticItemsConfigCommand extends BaseAppCommand {

    protected executeInternal(): void {

        let loadManager: LoadManager = getInstance(LoadManager);
        let staticItemsConfigFileItem: AbstractLoadItem = loadManager.getLoadItem(AppSettings.staticItemsFileId);
        if (staticItemsConfigFileItem && staticItemsConfigFileItem.data) {
            const staticData: IItemsConfigVO = staticItemsConfigFileItem.data;

            let genericObjectsByTypeModel: GenericObjectsByTypeModel = getInstance(GenericObjectsByTypeModel);
            if (staticData.items) {
                genericObjectsByTypeModel.commitItems(staticData.items);
            }

            this.notifyComplete();

        } else {
            console.error("ParseStaticItemsCommand | executeInternal __ ERROR! Can't find config file!");
            this.errorCode = CommandErrorCode.GENERAL_ERROR;
            this.terminate();
        }

    }

}