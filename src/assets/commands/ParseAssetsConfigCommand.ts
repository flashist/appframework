import {AbstractLoadItem, getInstance, LoadItemsListCommand, LoadManager} from "@flashist/flibs";

import {BaseAppCommand} from "../../base/commands/BaseAppCommand";
import {AppSettings} from "../../app/AppSettings";

export class ParseAssetsConfigCommand extends BaseAppCommand {

    protected executeInternal(): void {
        let loadManager: LoadManager = getInstance(LoadManager);
        let assetsConfigFileLoadItem: AbstractLoadItem = loadManager.getLoadItem(AppSettings.assetsConfigFileId);

        if (assetsConfigFileLoadItem && assetsConfigFileLoadItem.data) {
            if (assetsConfigFileLoadItem.data.files) {
                new LoadItemsListCommand(assetsConfigFileLoadItem.data.files)
                    .execute();
            }

            this.notifyComplete();

        } else {
            console.error("ParseAssetsConfigCommand | executeInternal __ ERROR! Can't find config file!");
            this.terminate();
        }
    }
}